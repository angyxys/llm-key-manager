import React from 'react';
import { Status } from '../types';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { color: string; label: string }> = {
  active: { color: 'bg-green-100 text-green-800 border-green-300', label: 'Active' },
  inactive: { color: 'bg-red-100 text-red-800 border-red-300', label: 'Inactive' },
  error: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Error' },
  unknown: { color: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Unknown' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.unknown;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${
        status === 'active' ? 'bg-green-500' :
        status === 'error' ? 'bg-yellow-500' :
        'bg-gray-500'
      }`}></span>
      {config.label}
    </span>
  );
};
