import React, { useState } from 'react';
import { Copy, Check, Edit2, Save, X, Eye, EyeOff, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyEntry, Provider } from '../types';
import { ProviderIcon } from './ProviderIcon';
import { AuditLog, AuditEntry } from './AuditLog';

interface KeyDetailsPanelProps {
  provider: Provider;
  entry: KeyEntry | null;
  onUpdate?: (id: string, newValue: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onToggleFavorite?: (id: string) => Promise<void>;
  onAddTag?: (id: string, tag: string) => Promise<void>;
  onUpdateNotes?: (id: string, notes: string) => Promise<void>;
  auditLog?: AuditEntry[];
}

export const KeyDetailsPanel: React.FC<KeyDetailsPanelProps> = ({
  provider,
  entry,
  onUpdate,
  onDelete,
  onToggleFavorite,
  onAddTag,
  onUpdateNotes,
  auditLog = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [showValue, setShowValue] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(entry?.notes || '');

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No key selected</p>
          <p className="text-sm">Choose a key from the list to view details</p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const handleEdit = () => {
    setEditValue(entry.apiKey);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    setIsLoading(true);
    try {
      await onUpdate(entry.id, editValue);
      setIsEditing(false);
      toast.success('Key updated successfully');
    } catch (error) {
      toast.error('Failed to update key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm('Delete this key? This action cannot be undone.')) return;

    setIsLoading(true);
    try {
      await onDelete(entry.id);
      toast.success('Key deleted successfully');
    } catch (error) {
      toast.error('Failed to delete key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <ProviderIcon provider={provider} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">{entry.name || 'Unnamed Key'}</h3>
                {entry.isFavorite && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
              </div>
              <p className="text-sm text-gray-400">{provider}</p>
            </div>
          </div>
          <button
            onClick={() => onToggleFavorite?.(entry.id)}
            className="p-2 hover:bg-gray-700 rounded transition text-gray-400 hover:text-yellow-400"
            title={entry.isFavorite ? 'Remove favorite' : 'Add to favorites'}
          >
            <Star size={18} className={entry.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
          </button>
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {entry.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Key Display */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">API Key</label>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:border-blue-500 focus:outline-none resize-none"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <code className={`flex-1 font-mono text-sm ${
                      showValue ? 'text-green-400' : 'text-gray-400'
                    } break-all`}>
                      {showValue ? entry.apiKey : '•'.repeat(Math.min(entry.apiKey.length, 50))}
                    </code>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setShowValue(!showValue)}
                        className="p-2 hover:bg-gray-700 rounded transition text-gray-400 hover:text-white"
                        title={showValue ? 'Hide' : 'Show'}
                      >
                        {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-700 rounded transition text-gray-400 hover:text-white"
                        title="Copy"
                      >
                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Created</p>
            <p className="text-sm text-gray-300">Recently</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Modified</p>
            <p className="text-sm text-gray-300">Just now</p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <MessageSquare size={16} />
              Notes
            </h4>
          </div>

          {editingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Add any notes about this key..."
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await onUpdateNotes?.(entry.id, notes);
                    setEditingNotes(false);
                    toast.success('Notes updated');
                  }}
                  className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNotes(entry.notes || '');
                    setEditingNotes(false);
                  }}
                  className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingNotes(true)}
              className="p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
              {notes ? (
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{notes}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Click to add notes...</p>
              )}
            </div>
          )}
        </div>

        {/* Audit Log */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Audit History</h4>
          <AuditLog entries={auditLog} />
        </div>
      </div>

      {/* Footer Actions */}
      {!isEditing && (
        <div className="p-6 border-t border-gray-700 bg-gray-900/50 flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg font-medium transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
};
