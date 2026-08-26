import React, { useState } from 'react';
import { Download, Copy, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { KeyEntry, Provider } from '../types';

interface KeyExporterProps {
  keys: Record<Provider, KeyEntry[]>;
  isOpen: boolean;
  onClose: () => void;
}

export const KeyExporter: React.FC<KeyExporterProps> = ({ keys, isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];

    if (exportFormat === 'json') {
      const data = Object.entries(keys).map(([provider, entries]) => ({
        provider,
        keys: entries.map((entry) => ({
          id: entry.id,
          name: entry.name,
          apiKey: entry.apiKey,
          tags: entry.tags || [],
          notes: entry.notes || '',
          createdAt: entry.createdAt,
        })),
      }));

      return JSON.stringify(data, null, 2);
    } else {
      let csv = 'Provider,Name,API Key,Tags,Created\n';
      Object.entries(keys).forEach(([provider, entries]) => {
        entries.forEach((entry) => {
          const tags = (entry.tags || []).join(';');
          const row = [
            provider,
            `"${entry.name}"`,
            `"${entry.apiKey}"`,
            `"${tags}"`,
            entry.createdAt?.toString() || '',
          ].join(',');
          csv += row + '\n';
        });
      });
      return csv;
    }
  };

  const handleCopy = () => {
    const content = generateExport();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Exported to clipboard');
  };

  const handleDownload = () => {
    const content = generateExport();
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);

    const timestamp = new Date().toISOString().split('T')[0];
    const ext = exportFormat === 'json' ? 'json' : 'csv';
    element.download = `api-keys-export-${timestamp}.${ext}`;

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('File downloaded');
  };

  const totalKeys = Object.values(keys).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Export API Keys</h2>
            <p className="text-sm text-gray-400 mt-1">
              Export {totalKeys} key{totalKeys !== 1 ? 's' : ''} in your preferred format
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Warning */}
            <div className="flex gap-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <AlertCircle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-100">
                Your API keys will be exported in plain text. Store this file securely and never share it.
              </p>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Export Format</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition">
                  <input
                    type="radio"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-white">JSON</p>
                    <p className="text-xs text-gray-400">Structured format with full metadata</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-white">CSV</p>
                    <p className="text-xs text-gray-400">Spreadsheet compatible format</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Preview</p>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                  {generateExport().slice(0, 300)}
                  {generateExport().length > 300 && '...'}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-700">
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
