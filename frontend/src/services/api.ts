import { KeyEntry, Provider } from "../types";

declare global {
    interface Window {
        go: {
            main: {
                App: {
                    GetMasterKeyStatus(): Promise<string>;
                    SetMasterKey(password: string): Promise<string>;
                    LoginWithMasterKey(password: string): Promise<string>;

                    GetKeys(): Promise<Record<Provider, KeyEntry[]>>;
                    GetKeyValue(provider: string, id: string): Promise<string>;
                    AddKey(provider: string, name: string, apiKey: string): Promise<string>;
                    DeleteKey(provider: string, id: string): Promise<string>;
                    UpdateKey(provider: string, id: string, newAPIKey: string): Promise<string>;

                    CheckStatus(provider: string): Promise<string>;
                    CheckAllStatuses(): Promise<Record<string, string>>;
                    GetStatuses(): Promise<Record<string, string>>;
                };
            };
        };
    }
}

// Helper to ensure Wails is ready
const getApp = () => {
    if (!window.go?.main?.App) {
        throw new Error('Wails runtime not initialized. Please ensure the application is running with Wails.');
    }
    return window.go.main.App;
};

export const api = {
    getMasterKeyStatus: () => getApp().GetMasterKeyStatus(),
    setMasterKey: (password: string) => getApp().SetMasterKey(password),
    loginWithMasterKey: (password: string) => getApp().LoginWithMasterKey(password),

    getKeys: () => getApp().GetKeys(),
    getKeyValue: (provider: string, id: string) => getApp().GetKeyValue(provider, id),
    addKey: (provider: string, name: string, apiKey: string) =>
        getApp().AddKey(provider, name, apiKey),
    deleteKey: (provider: string, id: string) => getApp().DeleteKey(provider, id),
    updateKey: (provider: string, id: string, newAPIKey: string) =>
        getApp().UpdateKey(provider, id, newAPIKey),

    checkStatus: (provider: string) => getApp().CheckStatus(provider),
    checkAllStatuses: () => getApp().CheckAllStatuses(),
    getStatuses: () => getApp().GetStatuses(),
};
