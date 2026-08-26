import React, { useState } from 'react';
import { FaFloppyDisk, FaPencil, FaTrash, FaPlus } from 'react-icons/fa6';
import { ProviderInfo, KeyEntry } from '../types';
import { useKeyStore } from '../store/useKeyStore';

interface KeyListProps {
  provider: ProviderInfo;
  entries: KeyEntry[];
}

export const KeyList: React.FC<KeyListProps> = ({ provider, entries }) => {
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const { addKey, deleteKey, updateKey, getKeyValue } = useKeyStore();

  const handleAdd = async () => {
    if (!newKey) return;
    await addKey(provider.name, newName || 'Unnamed Key', newKey);
    setNewName('');
    setNewKey('');
  };

  const handleEdit = async (id: string) => {
    if (editingId === id) {
      await updateKey(provider.name, id, editValue);
      setEditingId(null);
      setEditValue('');
    } else {
      const currentValue = await getKeyValue(provider.name, id);
      setEditValue(currentValue);
      setEditingId(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this key?')) {
      await deleteKey(provider.name, id);
    }
  };

  return (
    <div className="mb-8 p-4 border rounded-lg dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {provider.displayName}
      </h2>

      {entries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No keys configured</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <span className="font-medium text-gray-900 dark:text-white min-w-30">
                {entry.name || 'Unnamed'}
              </span>

              {editingId === entry.id ? (
                <input
                  type="password"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 p-1 border rounded dark:bg-gray-700 dark:text-white"
                  placeholder="New key..."
                />
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400 flex-1">
                  {entry.apiKey}
                </span>
              )}

              <button
                onClick={() => handleEdit(entry.id)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                title={editingId === entry.id ? 'Save' : 'Edit'}
              >
                {editingId === entry.id ? <FaFloppyDisk /> : <FaPencil />}
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Name (optional)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 min-w-30"
        />
        <input
          type="password"
          placeholder="API Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-2 min-w-50"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </div>
    </div>
  );
};
