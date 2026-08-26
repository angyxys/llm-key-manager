import React, { useEffect, useState } from 'react';
import { useKeyStore } from '../store/useKeyStore';
import { useProviders } from '../hooks/useProviders';
import { SearchBar } from '../components/SearchBar';
import { KeyCard } from '../components/KeyCard';
import { KeyDetailsPanel } from '../components/KeyDetailsPanel';
import { Modal } from '../components/Modal';
import { KeyGenerator } from '../components/KeyGenerator';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { KeyEntry, Provider } from '../types';

export const KeyManagement: React.FC = () => {
    const { keys, loadKeys, masterKeyStatus, addKey, deleteKey, updateKey, getKeyValue } = useKeyStore();
    const { providers } = useProviders();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedKey, setSelectedKey] = useState<{ provider: Provider; entry: KeyEntry } | null>(null);
    const [isAddingKey, setIsAddingKey] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider>('OpenAI');
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyValue, setNewKeyValue] = useState('');

    useEffect(() => {
        if (masterKeyStatus === 'verified') {
            loadKeys();
        }
    }, [masterKeyStatus]);

    const filteredKeys = Object.entries(keys).flatMap(([provider, entries]) =>
        entries
            .filter((entry) =>
                entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.apiKey.slice(0, 20).toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((entry) => ({ provider: provider as Provider, entry }))
    );

    const handleAddKey = async (generatedKey: string) => {
        setNewKeyValue(generatedKey);
    };

    const handleSaveNewKey = async () => {
        if (!newKeyValue.trim()) {
            toast.error('API key cannot be empty');
            return;
        }

        try {
            await addKey(selectedProvider, newKeyName || 'Unnamed Key', newKeyValue);
            setIsAddingKey(false);
            setNewKeyName('');
            setNewKeyValue('');
            toast.success('Key added successfully');
        } catch (error) {
            toast.error('Failed to add key');
        }
    };

    const handleDelete = async (provider: Provider, id: string) => {
        try {
            await deleteKey(provider, id);
            setSelectedKey(null);
            toast.success('Key deleted successfully');
        } catch (error) {
            toast.error('Failed to delete key');
        }
    };

    const handleUpdate = async (provider: Provider, id: string, newValue: string) => {
        try {
            await updateKey(provider, id, newValue);
            loadKeys();
            toast.success('Key updated successfully');
        } catch (error) {
            toast.error('Failed to update key');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">API Keys Management</h1>
                <p className="text-gray-400">Manage all your API keys in one secure place</p>
            </div>

            <div className="flex gap-4">
                <SearchBar onSearch={setSearchQuery} placeholder="Search by name or key..." />
                <button
                    onClick={() => setIsAddingKey(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex-shrink-0"
                >
                    <Plus size={18} />
                    Add Key
                </button>
            </div>

            {/* Layout: 2 Columnas */}
            <div className="grid grid-cols-3 gap-6 h-[calc(100vh-300px)]">
                {/* Lista de Claves */}
                <div className="col-span-1 bg-gray-800 rounded-lg border border-gray-700 p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-white mb-4">Keys</h2>
                    {filteredKeys.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400 text-sm">No keys found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredKeys.map(({ provider, entry }) => (
                                <KeyCard
                                    key={entry.id}
                                    provider={provider}
                                    entry={entry}
                                    isSelected={selectedKey?.entry.id === entry.id}
                                    onSelect={() => setSelectedKey({ provider, entry })}
                                    onCopy={() => navigator.clipboard.writeText(entry.apiKey)}
                                    onDelete={() => handleDelete(provider, entry.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Panel de Detalles */}
                <div className="col-span-2">
                    {selectedKey ? (
                        <KeyDetailsPanel
                            provider={selectedKey.provider}
                            entry={selectedKey.entry}
                            onUpdate={(id, newValue) => handleUpdate(selectedKey.provider, id, newValue)}
                            onDelete={(id) => handleDelete(selectedKey.provider, id)}
                        />
                    ) : (
                        <div className="h-full bg-gray-800 rounded-lg border border-gray-700 border-dashed flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-gray-400 text-lg font-medium mb-2">No key selected</p>
                                <p className="text-gray-500 text-sm">Choose a key from the list or add a new one</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para agregar nueva clave */}
            <Modal
                isOpen={isAddingKey}
                onClose={() => setIsAddingKey(false)}
                title="Add New API Key"
                size="lg"
                actions={
                    <>
                        <button
                            onClick={() => setIsAddingKey(false)}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveNewKey}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                        >
                            Save Key
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Provider</label>
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value as Provider)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 outline-none"
                        >
                            {providers.map((p) => (
                                <option key={p.name} value={p.name}>
                                    {p.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Key Name (Optional)</label>
                        <input
                            type="text"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g., Production API Key"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">API Key Value</label>
                        <textarea
                            value={newKeyValue}
                            onChange={(e) => setNewKeyValue(e.target.value)}
                            placeholder="Paste your API key here"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none resize-none"
                            rows={4}
                        />
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <p className="text-sm font-medium text-gray-300 mb-3">Or generate a random key:</p>
                        <KeyGenerator onGenerate={handleAddKey} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
