import React from 'react';
import { Provider } from '../types';

interface ProviderIconProps {
  provider: Provider;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const providerConfig: Record<Provider, { color: string; bgColor: string; icon: string }> = {
  OpenAI: { color: 'text-green-400', bgColor: 'bg-green-900/30', icon: '○' },
  Anthropic: { color: 'text-purple-400', bgColor: 'bg-purple-900/30', icon: '◆' },
  Google: { color: 'text-blue-400', bgColor: 'bg-blue-900/30', icon: 'G' },
  DeepSeek: { color: 'text-red-400', bgColor: 'bg-red-900/30', icon: 'D' },
};

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export const ProviderIcon: React.FC<ProviderIconProps> = ({ provider, size = 'md', showLabel = false }) => {
  const config = providerConfig[provider];

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} ${config.bgColor} ${config.color} rounded-lg flex items-center justify-center font-semibold border border-gray-700`}>
        {config.icon}
      </div>
      {showLabel && <span className="text-sm font-medium text-gray-300">{provider}</span>}
    </div>
  );
};
