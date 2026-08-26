# 🔐 LLM Key Manager

A secure, professional-grade API key management application for storing and managing multiple LLM provider credentials in one encrypted vault.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()
[![Built with](https://img.shields.io/badge/Built%20with-Wails%20%7C%20React%20%7C%20TypeScript-blueviolet.svg)]()

---

## ✨ Features

### 🔒 **Security First**
- **AES-256-GCM Encryption** - Military-grade encryption for all stored keys
- **PBKDF2 Master Key** - 100,000 iterations for maximum security
- **Auto-Lock Sessions** - Configurable inactivity timeout (1-60 minutes)
- **2FA TOTP** - Two-factor authentication with backup codes
- **Local Storage Only** - No cloud, no tracking, just your data

### 📦 **Key Management**
- **Multiple Providers** - OpenAI, Anthropic, Google Gemini, DeepSeek
- **Folder Organization** - Colored folders for project separation
- **Tag System** - 8 vibrant colors for categorization
- **Favorites** - Quick access to frequently used keys
- **Rich Notes** - Add documentation to each key

### 🔍 **Smart Search & Filter**
- **Full-Text Search** - Instantly find keys
- **Advanced Filters** - By provider, tags, folders
- **Real-Time Results** - Type and see results immediately
- **Multi-Select** - Combine filter criteria

### 💾 **Import/Export**
- **JSON Import** - Bulk import from files
- **CSV Import** - From spreadsheets
- **Secure Export** - JSON/CSV with metadata
- **Backup Codes** - Auto-generated recovery

### 📊 **Analytics & Monitoring**
- **Visual Dashboard** - Pie and bar charts
- **Usage Tracking** - Weekly analytics
- **Expiration Alerts** - Track key lifecycle
- **Audit Logs** - Complete history

### 🎨 **Professional UI**
- **Dark Theme** - Optimized for comfort
- **Smooth Animations** - Fluid interactions
- **31+ Components** - Production-ready
- **Keyboard Shortcuts** - Ctrl+K for search
- **Desktop Optimized** - Windows native

---

## 🚀 Quick Start

### Requirements
- Go 1.21+
- Node.js 18+
- Windows 10/11

### Installation

```bash
git clone https://github.com/yourusername/llm-key-manager.git
cd llm-key-manager

go mod download
cd frontend && npm install && cd ..

go install github.com/wailsapp/wails/v2/cmd/wails@latest

wails dev      # Development
wails build    # Production
```

---

## 📖 Usage

1. **Setup**: Create strong master password
2. **Add Keys**: Click "Add Key" → Select provider → Enter/generate key
3. **Organize**: Use folders, tags, and favorites
4. **Search**: Press Ctrl+K for full-text search
5. **Secure**: Enable auto-lock and 2FA in Settings

---

## 🏗️ Tech Stack

**Backend**: Go + Wails + Crypto (AES-GCM, PBKDF2)
**Frontend**: React 19 + TypeScript + Tailwind + Zustand + Framer Motion + Recharts

**Stats**: 31+ components | 4,700+ LOC | 20+ features | Enterprise security

---

## 🔐 Security

- **All local** - No cloud storage
- **AES-256-GCM** encryption
- **PBKDF2** key derivation (100,000 iterations)
- **Windows DPAPI** OS-level protection

### Best Practices
✅ Use 12+ character passwords
✅ Enable 2FA
✅ Save backup codes
✅ Enable auto-lock
✅ Rotate keys regularly

---

## 📋 Supported Providers

- OpenAI (GPT, Embeddings)
- Anthropic (Claude)
- Google Gemini
- DeepSeek
- Custom (coming soon)

---

## 🔜 Roadmap

See [ROADMAP.md](ROADMAP.md) for:
- Version 1.1 (Desktop enhancements)
- Version 2.0 (Backend & Cloud)
- Future features

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m 'Add feature'
git push origin feature/your-feature
```

Open a Pull Request!

---

## 📄 License

MIT - See [LICENSE](LICENSE)

---

## ⚠️ Notice

This app provides enterprise-grade encryption, but:
- Use strong master passwords
- Save backup codes securely
- Consider as part of overall security strategy
- Keep application updated

---

## 🙋 Support

- Issues: [GitHub Issues](https://github.com/yourusername/llm-key-manager/issues)
- Security: Email privately (no public issues)

---

If you find this helpful, please ⭐ on GitHub!

**Version**: 1.0.0 | **Status**: Production Ready | **License**: MIT
