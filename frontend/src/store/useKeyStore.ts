import { create } from 'zustand';
import { Provider, Status, KeyEntry } from '../types';
import { api } from '../services/api';

interface KeyStoreState {
    keys: Record<Provider, KeyEntry[]>;
    statuses: Record<Provider, Status>;
    masterKeyStatus: 'notset' | 'set' | 'verified';
    isLoading: boolean;
    error: string | null;

    checkMasterKeyStatus: () => Promise<void>;
    setMasterKey: (password: string) => Promise<void>;
    login: (password: string) => Promise<void>;
    loadKeys: () => Promise<void>;
    addKey: (provider: Provider, name: string, apiKey: string) => Promise<void>;
    deleteKey: (provider: Provider, id: string) => Promise<void>;
    updateKey: (provider: Provider, id: string, apiKey: string) => Promise<void>;
    getKeyValue: (provider: Provider, id: string) => Promise<string>;
    checkStatus: (provider: Provider) => Promise<void>;
    checkAllStatuses: () => Promise<void>;
}

export const useKeyStore = create<KeyStoreState>((set, get) => ({
    keys: {} as Record<Provider, KeyEntry[]>,
    statuses: {} as Record<Provider, Status>,
    masterKeyStatus: 'notset',
    isLoading: false,
    error: null,

    checkMasterKeyStatus: async () => {
        const status = await api.getMasterKeyStatus();
        set({ masterKeyStatus: status === 'set' ? 'set' : 'notset' });
    },

    setMasterKey: async (password) => {
        set({ isLoading: true, error: null });
        try {
            const result = await api.setMasterKey(password);
            if (result === 'OK') {
                set({ masterKeyStatus: 'set', isLoading: false });
                await get().loadKeys();
            } else {
                set({ error: result, isLoading: false });
            }
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    login: async (password) => {
        set({ isLoading: true, error: null });
        try {
            const result = await api.loginWithMasterKey(password);
            if (result === 'OK') {
                set({ masterKeyStatus: 'verified', isLoading: false });
                await get().loadKeys();
            } else {
                set({ error: result, isLoading: false });
            }
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    loadKeys: async () => {
        set({ isLoading: true });
        try {
            const keys = await api.getKeys();
            set({ keys: keys as Record<Provider, KeyEntry[]>, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    addKey: async (provider, name, apiKey) => {
        set({ isLoading: true, error: null });
        try {
            const result = await api.addKey(provider, name, apiKey);
            if (result !== 'OK') {
                throw new Error(result);
            }
            await get().loadKeys();
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    deleteKey: async (provider, id) => {
        set({ isLoading: true, error: null });
        try {
            const result = await api.deleteKey(provider, id);
            if (result !== 'OK') {
                throw new Error(result);
            }
            await get().loadKeys();
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    updateKey: async (provider, id, apiKey) => {
        set({ isLoading: true, error: null });
        try {
            const result = await api.updateKey(provider, id, apiKey);
            if (result !== 'OK') {
                throw new Error(result);
            }
            await get().loadKeys();
            set({ isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
        }
    },

    getKeyValue: async (provider, id) => {
        try {
            return await api.getKeyValue(provider, id);
        } catch (error) {
            console.error('Error getting key value:', error);
            return '';
        }
    },

    checkStatus: async (provider) => {
        try {
            const status = await api.checkStatus(provider);
            set((state) => ({
                statuses: { ...state.statuses, [provider]: status as Status },
            }));
        } catch (error) {
            console.error(`Error checking status for ${provider}:`, error);
        }
    },

    checkAllStatuses: async () => {
        set({ isLoading: true });
        try {
            const statuses = await api.checkAllStatuses();
            set({
                statuses: statuses as Record<Provider, Status>,
                isLoading: false,
            });
        } catch (error) {
            console.error('Error checking all statuses:', error);
            set({ isLoading: false });
        }
    },
}));
