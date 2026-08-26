import React from 'react';
import { ProviderInfo, Status } from '../types';
import { StatusBadge } from './StatusBadge';

interface ProviderCardProps {
  provider: ProviderInfo;
  status: Status;
  keyCount: number;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  status,
  keyCount,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {provider.displayName}
          </h3>
          <StatusBadge status={status} />
        </div>
        <a
          href={provider.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Get Key
        </a>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {keyCount > 0 ? (
          <p>{keyCount} key{keyCount > 1 ? 's' : ''} configured</p>
        ) : (
          <p className="text-gray-400">No keys configured</p>
        )}
      </div>
    </div>
  );
};
