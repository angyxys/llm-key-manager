import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, File } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyEntry, Provider } from '../types';

interface KeyImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (keys: Array<{ provider: Provider; entries: KeyEntry[] }>) => Promise<void>;
}

export const KeyImporter: React.FC<KeyImporterProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [step, setStep] = useState<'upload' | 'review' | 'importing'>('upload');
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let data;

        if (selectedFile.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else if (selectedFile.name.endsWith('.csv')) {
          data = parseCSV(content);
        } else {
          toast.error('Only JSON and CSV files are supported');
          return;
        }

        setFile(selectedFile);
        setPreview(data);
        setStep('review');
        toast.success('File loaded successfully');
      } catch (error) {
        toast.error('Failed to parse file');
      }
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (content: string) => {
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',');
      const obj: any = {};

      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });

      data.push(obj);
    }

    return data;
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const grouped: Record<Provider, KeyEntry[]> = {
        OpenAI: [],
        Anthropic: [],
        Google: [],
        DeepSeek: [],
      };

      preview.forEach((item) => {
        const provider = item.provider || item.Provider || 'OpenAI';
        const entry: KeyEntry = {
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: item.name || item.Name || 'Imported Key',
          apiKey: item.apiKey || item['API Key'] || '',
          tags: item.tags ? item.tags.split(';') : [],
          notes: item.notes || item.Notes || '',
          createdAt: new Date(),
        };

        if (entry.apiKey) {
          grouped[provider as Provider]?.push(entry);
        }
      });

      const keysToImport = Object.entries(grouped)
        .filter(([_, entries]) => entries.length > 0)
        .map(([provider, entries]) => ({
          provider: provider as Provider,
          entries,
        }));

      if (keysToImport.length === 0) {
        toast.error('No valid keys found in file');
        return;
      }

      await onImport(keysToImport);
      toast.success(`Imported ${preview.length} keys successfully`);
      setStep('importing');

      setTimeout(() => {
        setFile(null);
        setPreview([]);
        setStep('upload');
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to import keys');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 z-50"
      >
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Import API Keys</h2>
            <p className="text-sm text-gray-400 mt-1">
              Import from JSON or CSV file
            </p>
          </div>

          <div className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              {step === 'upload' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload size={32} className="mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-300 mb-1">
                      Drag or click to select file
                    </p>
                    <p className="text-xs text-gray-500">
                      JSON or CSV format
                    </p>
                  </div>

                  <input
                    id="file-input"
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                    <p className="text-xs text-blue-200">
                      <strong>JSON Format:</strong> Array of objects with provider, name, apiKey, tags
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}

              {step === 'review' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <File size={20} className="text-blue-400" />
                    <span className="text-sm text-gray-300">{file?.name}</span>
                    <span className="text-xs text-gray-500">{preview.length} items</span>
                  </div>

                  <div className="bg-gray-800 rounded-lg max-h-64 overflow-y-auto">
                    <div className="space-y-1">
                      {preview.slice(0, 5).map((item, i) => (
                        <div key={i} className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                          <p className="font-mono">{item.name || item.Name || 'N/A'}</p>
                          <p className="text-gray-500">{item.provider || item.Provider || 'OpenAI'}</p>
                        </div>
                      ))}
                      {preview.length > 5 && (
                        <div className="px-4 py-2 text-xs text-gray-500 text-center">
                          ... and {preview.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep('upload')}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={isImporting}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition"
                    >
                      {isImporting ? 'Importing...' : 'Import'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'importing' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle size={48} className="mx-auto mb-3 text-green-400" />
                  <p className="text-sm font-medium text-white mb-1">Import Complete!</p>
                  <p className="text-xs text-gray-400">
                    {preview.length} keys imported successfully
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};
