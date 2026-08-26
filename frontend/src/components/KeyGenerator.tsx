import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface KeyGeneratorProps {
  onGenerate: (key: string) => void;
}

export const KeyGenerator: React.FC<KeyGeneratorProps> = ({ onGenerate }) => {
  const [generatedKey, setGeneratedKey] = useState('');
  const [length, setLength] = useState(32);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '!@#$%^&*_+-=[]{}|;:,.<>?';
    const pool = chars + (includeSymbols ? symbols : '');

    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool.charAt(Math.floor(Math.random() * pool.length));
    }

    setGeneratedKey(result);
    onGenerate(result);
    toast.success('Key generated successfully');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Key Length</label>
        <input
          type="range"
          min="16"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-400 mt-1">{length} characters</p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includeSymbols}
          onChange={(e) => setIncludeSymbols(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-gray-300">Include special characters</span>
      </label>

      {generatedKey && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-2">Generated Key</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-green-400 break-all font-mono">{generatedKey}</code>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-700 rounded transition"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={generateKey}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        <RefreshCw size={16} />
        Generate Key
      </button>
    </div>
  );
};
