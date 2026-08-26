package main

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"golang.org/x/crypto/pbkdf2"
)

type KeyEntry struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	APIKey string `json:"apiKey"`
}

type KeyStore struct {
	Providers map[string][]KeyEntry `json:"providers"`
}

type App struct {
	ctx       context.Context
	masterKey []byte
	keys      map[string][]KeyEntry
	statuses  map[string]string
}

func NewApp() *App {
	return &App{
		keys:     make(map[string][]KeyEntry),
		statuses: make(map[string]string),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) getSaltPath() string {
	appData := os.Getenv("APPDATA")
	dir := filepath.Join(appData, "LLMKeyManager")
	os.MkdirAll(dir, 0700)
	return filepath.Join(dir, "salt.bin")
}

func (a *App) getStorePath() string {
	appData := os.Getenv("APPDATA")
	dir := filepath.Join(appData, "LLMKeyManager")
	return filepath.Join(dir, "keys.enc")
}

func (a *App) SetMasterKey(password string) string {
	if len(password) < 8 {
		return "Password must be at least 8 characters"
	}

	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "Error generating salt: " + err.Error()
	}

	key := pbkdf2.Key([]byte(password), salt, 100000, 32, sha256.New)
	a.masterKey = key

	if err := os.WriteFile(a.getSaltPath(), salt, 0600); err != nil {
		return "Error saving salt: " + err.Error()
	}

	a.keys = make(map[string][]KeyEntry)
	if err := a.saveStore(); err != nil {
		return "Error saving initial store: " + err.Error()
	}

	return "OK"
}

func (a *App) LoginWithMasterKey(password string) string {
	salt, err := os.ReadFile(a.getSaltPath())
	if err != nil {
		return "Error: salt not found. Have you set a master key?"
	}

	key := pbkdf2.Key([]byte(password), salt, 100000, 32, sha256.New)
	a.masterKey = key

	if err := a.loadStore(); err != nil {
		return "Error: incorrect master key or corrupted data"
	}
	return "OK"
}

func (a *App) GetMasterKeyStatus() string {
	if _, err := os.Stat(a.getSaltPath()); os.IsNotExist(err) {
		return "notset"
	}
	return "set"
}

func (a *App) encryptStore(store KeyStore) (string, error) {
	data, err := json.Marshal(store)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(a.masterKey)
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}
	ciphertext := gcm.Seal(nonce, nonce, data, nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func (a *App) decryptStore(encoded string) (*KeyStore, error) {
	ciphertext, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher(a.masterKey)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return nil, fmt.Errorf("ciphertext too short")
	}
	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	var store KeyStore
	if err := json.Unmarshal(plaintext, &store); err != nil {
		return nil, err
	}
	return &store, nil
}

func (a *App) saveStore() error {
	store := KeyStore{Providers: a.keys}
	encrypted, err := a.encryptStore(store)
	if err != nil {
		return err
	}
	return os.WriteFile(a.getStorePath(), []byte(encrypted), 0600)
}

func (a *App) loadStore() error {
	path := a.getStorePath()
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			a.keys = make(map[string][]KeyEntry)
			return nil
		}
		return err
	}
	store, err := a.decryptStore(string(data))
	if err != nil {
		return err
	}
	a.keys = store.Providers
	if a.keys == nil {
		a.keys = make(map[string][]KeyEntry)
	}
	return nil
}

func (a *App) GetKeys() map[string][]KeyEntry {
	result := make(map[string][]KeyEntry)
	for provider, entries := range a.keys {
		var hidden []KeyEntry
		for _, e := range entries {
			hidden = append(hidden, KeyEntry{
				ID:     e.ID,
				Name:   e.Name,
				APIKey: "••••••••",
			})
		}
		result[provider] = hidden
	}
	return result
}

func (a *App) GetKeyValue(provider, id string) string {
	entries, ok := a.keys[provider]
	if !ok {
		return ""
	}
	for _, e := range entries {
		if e.ID == id {
			return e.APIKey
		}
	}
	return ""
}

func (a *App) AddKey(provider, name, apiKey string) string {
	if a.masterKey == nil {
		return "error: master key not set"
	}
	if apiKey == "" {
		return "error: API key cannot be empty"
	}

	entry := KeyEntry{
		ID:     uuid.New().String(),
		Name:   name,
		APIKey: apiKey,
	}
	a.keys[provider] = append(a.keys[provider], entry)

	if err := a.saveStore(); err != nil {
		return "error saving: " + err.Error()
	}
	return "OK"
}

func (a *App) DeleteKey(provider, id string) string {
	if a.masterKey == nil {
		return "error: master key not set"
	}

	entries, ok := a.keys[provider]
	if !ok {
		return "error: provider not found"
	}
	newEntries := []KeyEntry{}
	for _, e := range entries {
		if e.ID != id {
			newEntries = append(newEntries, e)
		}
	}
	a.keys[provider] = newEntries

	if err := a.saveStore(); err != nil {
		return "error saving: " + err.Error()
	}
	return "OK"
}

func (a *App) UpdateKey(provider, id, newAPIKey string) string {
	if a.masterKey == nil {
		return "error: master key not set"
	}
	if newAPIKey == "" {
		return "error: API key cannot be empty"
	}

	entries, ok := a.keys[provider]
	if !ok {
		return "error: provider not found"
	}
	for i, e := range entries {
		if e.ID == id {
			a.keys[provider][i].APIKey = newAPIKey
			break
		}
	}

	if err := a.saveStore(); err != nil {
		return "error saving: " + err.Error()
	}
	return "OK"
}

func (a *App) CheckStatus(provider string) string {
	entries, ok := a.keys[provider]
	if !ok || len(entries) == 0 {
		a.statuses[provider] = "inactive"
		return "inactive"
	}
	a.statuses[provider] = "active"
	return "active"
}

func (a *App) CheckAllStatuses() map[string]string {
	for provider := range a.keys {
		a.CheckStatus(provider)
	}
	return a.statuses
}

func (a *App) GetStatuses() map[string]string {
	return a.statuses
}

func (a *App) OnBeforeClose(ctx context.Context) bool {
	return true
}
