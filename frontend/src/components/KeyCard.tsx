import React from 'react';
import { Copy, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { KeyEntry, Provider } from '../types';
import { ProviderIcon } from './ProviderIcon';

interface KeyCardProps {
  provider: Provider;
  entry: KeyEntry;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
}

export const KeyCard: React.FC<KeyCardProps> = ({
  provider,
  entry,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onCopy,
}) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(entry.apiKey);
    toast.success('Copied to clipboard');
    onCopy?.();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this key?')) {
      onDelete?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onSelect}
      className={`p-4 rounded-lg border transition-all cursor-pointer group ${
        isSelected
          ? 'bg-blue-900/20 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ProviderIcon provider={provider} size="sm" />
            <h3 className="font-medium text-white truncate">{entry.name || 'Unnamed Key'}</h3>
          </div>
          <p className="text-xs text-gray-500 truncate font-mono">
            {entry.apiKey.slice(0, 20)}...
          </p>
        </div>

        <ChevronRight size={18} className="text-gray-600 group-hover:text-gray-400 transition" />
      </div>

      {/* Action Buttons - Visible on hover */}
      <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded text-xs font-medium transition"
          title="Copy"
        >
          <Copy size={14} />
          Copy
        </button>
        <button
          onClick={handleEdit}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition"
          title="Edit"
        >
          <Edit2 size={14} />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded text-xs font-medium transition"
          title="Delete"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </motion.div>
  );
};
