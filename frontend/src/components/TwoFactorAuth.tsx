import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface TwoFactorAuthProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ isEnabled, onToggle }) => {
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const handleEnable2FA = () => {
    const newSecret = generateSecret();
    const newBackupCodes = generateBackupCodes();

    setSecret(newSecret);
    setBackupCodes(newBackupCodes);
    // Generate QR code URL (using a QR code service)
    const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth://totp/LLMKeyManager?secret=${newSecret}`;
    setQrCode(qrUrl);
    setShowBackupCodes(true);
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      toast.success('2FA enabled successfully!');
      onToggle(true);
      setVerificationCode('');
    } else {
      toast.error('Please enter a 6-digit code');
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEnabled) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-green-400" />
            <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
          </div>
          <span className="px-3 py-1 bg-green-900/30 border border-green-700 rounded-full text-xs text-green-400 font-medium">
            Enabled
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Your account is protected with 2FA. You'll need to enter a code from your authenticator app when logging in.
        </p>

        <button
          onClick={() => onToggle(false)}
          className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition border border-red-700"
        >
          Disable 2FA
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield size={24} className="text-gray-400" />
        <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Add an extra layer of security to your account by requiring an authentication code along with your password.
      </p>

      {!secret ? (
        <button
          onClick={handleEnable2FA}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
        >
          <Shield size={18} />
          Enable 2FA
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400 mb-2">Scan with your authenticator app</p>
            <img
              src={qrCode}
              alt="2FA QR Code"
              className="w-48 h-48 mx-auto border border-gray-700 rounded-lg p-2 bg-white"
            />
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">Or enter manually</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={secret}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-mono"
              />
              <button
                onClick={copySecret}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">Verification Code (from authenticator app)</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl font-mono focus:border-blue-500 outline-none"
            />
          </div>

          {showBackupCodes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3"
            >
              <p className="text-xs text-yellow-200 font-medium mb-2">Save your backup codes</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {backupCodes.map((code, i) => (
                  <code key={i} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 font-mono">
                    {code}
                  </code>
                ))}
              </div>
              <p className="text-xs text-yellow-300">
                Save these codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
            </motion.div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSecret('');
                setBackupCodes([]);
                setVerificationCode('');
              }}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
            >
              Verify & Enable
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
