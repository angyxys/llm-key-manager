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

export const api = {
    getMasterKeyStatus: () => window.go.main.App.GetMasterKeyStatus(),
    setMasterKey: (password: string) => window.go.main.App.SetMasterKey(password),
    loginWithMasterKey: (password: string) => window.go.main.App.LoginWithMasterKey(password),

    getKeys: () => window.go.main.App.GetKeys(),
    getKeyValue: (provider: string, id: string) => window.go.main.App.GetKeyValue(provider, id),
    addKey: (provider: string, name: string, apiKey: string) =>
        window.go.main.App.AddKey(provider, name, apiKey),
    deleteKey: (provider: string, id: string) => window.go.main.App.DeleteKey(provider, id),
    updateKey: (provider: string, id: string, newAPIKey: string) =>
        window.go.main.App.UpdateKey(provider, id, newAPIKey),

    checkStatus: (provider: string) => window.go.main.App.CheckStatus(provider),
    checkAllStatuses: () => window.go.main.App.CheckAllStatuses(),
    getStatuses: () => window.go.main.App.GetStatuses(),
};
