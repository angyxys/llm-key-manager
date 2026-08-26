import React, { useState } from 'react';
import { AlertCircle, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ExpiringKey {
  id: string;
  name: string;
  provider: string;
  expiresAt: Date;
  daysLeft: number;
}

interface KeyExpirationManagerProps {
  expiringKeys: ExpiringKey[];
  onRenew?: (keyId: string) => Promise<void>;
  onDelete?: (keyId: string) => Promise<void>;
}

export const KeyExpirationManager: React.FC<KeyExpirationManagerProps> = ({
  expiringKeys,
  onRenew,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getExpirationColor = (daysLeft: number) => {
    if (daysLeft <= 7) return 'bg-red-900/20 border-red-700 text-red-400';
    if (daysLeft <= 30) return 'bg-yellow-900/20 border-yellow-700 text-yellow-400';
    return 'bg-blue-900/20 border-blue-700 text-blue-400';
  };

  const getExpirationIcon = (daysLeft: number) => {
    if (daysLeft <= 7) return '⚠️ URGENT';
    if (daysLeft <= 30) return '⏰ SOON';
    return '📅 INFO';
  };

  const handleRenew = async (keyId: string) => {
    if (!onRenew) return;
    setIsLoading(true);
    try {
      await onRenew(keyId);
      toast.success('Key renewed successfully');
    } catch (error) {
      toast.error('Failed to renew key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (keyId: string) => {
    if (!onDelete) return;
    if (!window.confirm('Delete this key?')) return;

    setIsLoading(true);
    try {
      await onDelete(keyId);
      toast.success('Key deleted successfully');
    } catch (error) {
      toast.error('Failed to delete key');
    } finally {
      setIsLoading(false);
    }
  };

  if (expiringKeys.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-orange-400" />
        <h3 className="font-semibold text-white">Keys Expiring Soon</h3>
        <span className="text-xs bg-orange-900/30 px-2 py-1 rounded-full text-orange-400">
          {expiringKeys.length}
        </span>
      </div>

      {expiringKeys.map((key) => (
        <motion.div
          key={key.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`border rounded-lg p-4 ${getExpirationColor(key.daysLeft)}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="font-medium mb-1">{key.name || 'Unnamed Key'}</p>
              <p className="text-xs opacity-75">{key.provider}</p>
            </div>
            <span className="text-xs font-semibold whitespace-nowrap ml-2">
              {getExpirationIcon(key.daysLeft)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm mb-3">
            <span>
              Expires in <strong>{key.daysLeft}</strong> day{key.daysLeft !== 1 ? 's' : ''}
            </span>
            <span className="text-xs opacity-75">
              {key.expiresAt.toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleRenew(key.id)}
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm font-medium transition"
            >
              Renew
            </button>
            <button
              onClick={() => handleDelete(key.id)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded transition"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
