import React from 'react';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';

export interface AuditEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'access';
  timestamp: Date;
  details: string;
  user?: string;
}

interface AuditLogProps {
  entries?: AuditEntry[];
}

const actionIcons = {
  create: <Plus size={14} className="text-green-400" />,
  update: <Edit size={14} className="text-blue-400" />,
  delete: <Trash2 size={14} className="text-red-400" />,
  access: <Clock size={14} className="text-gray-400" />,
};

const actionLabels = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  access: 'Accessed',
};

export const AuditLog: React.FC<AuditLogProps> = ({ entries = [] }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={24} className="text-gray-600 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">No audit history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex-shrink-0 pt-1">
            {actionIcons[entry.action]}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              <span className="font-medium">{actionLabels[entry.action]}</span>
              {entry.user && <span className="text-gray-500"> by {entry.user}</span>}
            </p>
            <p className="text-xs text-gray-500 mt-1">{entry.details}</p>
            <p className="text-xs text-gray-600 mt-1">
              {entry.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
