import React, { useState } from 'react';
import { Shield, Lock, HardDrive, Zap, AlertCircle, Copy, Check, Clock, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useKeyStore } from '../store/useKeyStore';
import { KeyImporter } from '../components/KeyImporter';

export const Settings: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [autoLockMinutes, setAutoLockMinutes] = useState(15);
  const [showImporter, setShowImporter] = useState(false);
  const { keys } = useKeyStore();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Copied to clipboard');
  };

  const sections = [
    {
      icon: Shield,
      title: 'Security',
      items: [
        {
          label: 'Encryption Method',
          description: 'Windows DPAPI (Data Protection API)',
          detail: 'All API keys are encrypted at rest using your Windows user account credentials',
        },
        {
          label: 'Master Key',
          description: 'PBKDF2 with SHA-256',
          detail: 'Your master password is derived using PBKDF2 with 100,000 iterations for added security',
        },
        {
          label: 'Key Storage',
          description: 'AES-256-GCM',
          detail: 'Individual API keys are encrypted using AES-256 in GCM mode',
        },
        {
          label: 'Auto-Lock Session',
          description: autoLockEnabled ? `Enabled (${autoLockMinutes} minutes)` : 'Disabled',
          detail: 'Automatically lock the application after inactivity',
          isToggle: true,
          toggleValue: autoLockEnabled,
          onToggle: (val: boolean) => setAutoLockEnabled(val),
        },
      ],
    },
    {
      icon: HardDrive,
      title: 'Storage',
      items: [
        {
          label: 'Storage Location',
          value: '%APPDATA%\\LLMKeyManager\\keys.enc',
          copyable: true,
          detail: 'Encrypted key store location on your system',
        },
        {
          label: 'Salt Storage',
          value: '%APPDATA%\\LLMKeyManager\\salt.bin',
          copyable: true,
          detail: 'Master key salt location (not encrypted)',
        },
      ],
    },
    {
      icon: Zap,
      title: 'Performance',
      items: [
        {
          label: 'Key Derivation',
          description: '100,000 iterations',
          detail: 'PBKDF2 iterations for master key derivation',
        },
        {
          label: 'Nonce Size',
          description: '12 bytes (96 bits)',
          detail: 'Standard nonce size for GCM mode encryption',
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Application configuration and security information</p>
      </div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg"
      >
        <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-medium text-yellow-200 mb-1">Important Security Notice</p>
          <p className="text-sm text-yellow-100">
            Never share your master password. It is the only way to access your encrypted keys. If you forget it,
            you will permanently lose access to all stored API keys.
          </p>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon;

          return (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                <div className="p-3 bg-blue-900/30 rounded-lg">
                  <Icon size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              </div>

              {/* Section Items */}
              <div className="divide-y divide-gray-700">
                {section.items.map((item: any, itemIndex) => (
                  <div key={itemIndex} className="p-6 hover:bg-gray-750 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-200 mb-1">{item.label}</p>
                        {item.value ? (
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-green-400 bg-gray-900 px-3 py-2 rounded font-mono">
                              {item.value}
                            </code>
                            {item.copyable && (
                              <button
                                onClick={() => copyToClipboard(item.value, item.label)}
                                className="p-2 hover:bg-gray-700 rounded transition text-gray-400 hover:text-white"
                              >
                                {copied === item.label ? (
                                  <Check size={16} className="text-green-400" />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </button>
                            )}
                          </div>
                        ) : item.isToggle ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.toggleValue}
                              onChange={(e) => item.onToggle(e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-300">{item.description}</span>
                          </label>
                        ) : (
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        )}
                        {item.detail && (
                          <p className="text-xs text-gray-500 mt-2">{item.detail}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="p-3 bg-green-900/30 rounded-lg">
            <Download size={20} className="text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Data Management</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Export Keys</p>
            <p className="text-xs text-gray-500 mb-3">
              Export your API keys in JSON or CSV format. The file will contain {Object.values(keys).reduce((sum, arr) => sum + arr.length, 0)} key{Object.values(keys).reduce((sum, arr) => sum + arr.length, 0) !== 1 ? 's' : ''}.
            </p>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
              <Download size={16} className="inline mr-2" />
              Export Keys
            </button>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm font-medium text-gray-300 mb-2">Backup</p>
            <p className="text-xs text-gray-500 mb-3">
              Create a secure backup of your entire key database.
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              Create Backup
            </button>
          </div>
        </div>
      </motion.div>

      {/* Auto-Lock Settings */}
      {autoLockEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
        >
          <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="p-3 bg-orange-900/30 rounded-lg">
              <Clock size={20} className="text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Auto-Lock Timeout</h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Lock after {autoLockMinutes} minutes of inactivity
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 min</span>
                <span>30 min</span>
                <span>60 min</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Your session will automatically lock if no activity is detected for the specified time.
            </p>
          </div>
        </motion.div>
      )}

      {/* Import Keys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="p-3 bg-purple-900/30 rounded-lg">
            <Download size={20} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Import Keys</h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-400 mb-4">
            Import your API keys from a JSON or CSV file. All imported keys will be encrypted with your master password.
          </p>
          <button
            onClick={() => setShowImporter(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            Import from File
          </button>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.33 }}
        className="bg-gray-800 border border-gray-700 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">About</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Application Version</span>
            <span className="text-white font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Built With</span>
            <span className="text-white">Wails + React + TypeScript + Tailwind CSS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">License</span>
            <span className="text-white">MIT</span>
          </div>
          <div className="pt-3 border-t border-gray-700 flex justify-between">
            <span className="text-gray-400">Platform</span>
            <span className="text-white">Windows Desktop (v1.0)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Features</span>
            <span className="text-white text-sm">Folders, Tags, Auto-lock, Export</span>
          </div>
        </div>
      </motion.div>

      {/* Import Modal */}
      <KeyImporter
        isOpen={showImporter}
        onClose={() => setShowImporter(false)}
        onImport={async (keys) => {
          console.log('Importing keys:', keys);
          // Here you would call your import API
        }}
      />
    </div>
  );
};
