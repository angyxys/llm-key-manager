import React, { useEffect, useState } from 'react';
import { useKeyStore } from '../store/useKeyStore';
import { useProviders } from '../hooks/useProviders';
import { ProviderIcon } from '../components/ProviderIcon';
import { DashboardCharts } from '../components/DashboardCharts';
import { KeyExpirationManager } from '../components/KeyExpirationManager';
import { motion } from 'framer-motion';
import { TrendingUp, Key, Shield, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { keys, statuses, loadKeys, checkAllStatuses, masterKeyStatus } = useKeyStore();
  const { providers } = useProviders();

  useEffect(() => {
    if (masterKeyStatus === 'verified') {
      loadKeys();
    }
  }, [masterKeyStatus]);

  useEffect(() => {
    if (Object.keys(keys).length > 0) {
      checkAllStatuses();
    }
  }, [keys]);

  const totalProviders = providers.length;
  const activeProviders = providers.filter(
    (p) => statuses[p.name] === 'active'
  ).length;
  const configuredProviders = providers.filter(
    (p) => keys[p.name] && keys[p.name].length > 0
  ).length;
  const totalKeys = Object.values(keys).reduce((acc, arr) => acc + arr.length, 0);

  const stats = [
    {
      icon: Key,
      label: 'Total Keys',
      value: totalKeys,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-900/20',
    },
    {
      icon: Shield,
      label: 'Active Providers',
      value: `${activeProviders}/${totalProviders}`,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-900/20',
    },
    {
      icon: TrendingUp,
      label: 'Configured',
      value: `${configuredProviders}/${totalProviders}`,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-900/20',
    },
    {
      icon: AlertCircle,
      label: 'Status',
      value: activeProviders === totalProviders ? 'Healthy' : 'Review',
      color: activeProviders === totalProviders ? 'from-green-500 to-green-600' : 'from-yellow-500 to-yellow-600',
      bgColor: activeProviders === totalProviders ? 'bg-green-900/20' : 'bg-yellow-900/20',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage and monitor your API keys</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.bgColor} border border-gray-700 rounded-lg p-6 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Analytics</h2>
        <DashboardCharts keys={keys} />
      </div>

      {/* Key Expiration Manager */}
      <div>
        <KeyExpirationManager expiringKeys={[]} />
      </div>

      {/* Providers Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Provider Status</h2>
        <div className="grid grid-cols-1 gap-4">
          {providers.map((provider, i) => {
            const keyCount = keys[provider.name]?.length || 0;
            const isConfigured = keyCount > 0;

            return (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition"
              >
                <div className="flex items-center gap-4">
                  <ProviderIcon provider={provider.name} size="md" />
                  <div>
                    <h3 className="font-semibold text-white">{provider.displayName}</h3>
                    <p className="text-xs text-gray-400">
                      {isConfigured ? `${keyCount} key${keyCount > 1 ? 's' : ''}` : 'Not configured'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
