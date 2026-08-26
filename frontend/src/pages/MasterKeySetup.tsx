import React, { useState } from 'react';
import { useKeyStore } from '../store/useKeyStore';
import { Lock, Key, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const MasterKeySetup: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);
    const { masterKeyStatus, setMasterKey, login, error, isLoading } = useKeyStore();

    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { score: 0, label: 'None', color: 'bg-gray-400' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^a-zA-Z\d]/.test(pwd)) score++;

        if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
        if (score <= 3) return { score, label: 'Good', color: 'bg-blue-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    };

    const strength = getPasswordStrength(password);

    if (masterKeyStatus === 'set') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-blue-900/30 rounded-lg">
                            <Lock size={32} className="text-blue-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-white mb-2">
                        Unlock Your Keys
                    </h2>
                    <p className="text-sm text-gray-400 text-center mb-6">
                        Enter your master password to access your API keys
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Master Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                                onKeyDown={(e) => e.key === 'Enter' && login(password)}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg"
                            >
                                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200">{error}</p>
                            </motion.div>
                        )}

                        <button
                            onClick={() => login(password)}
                            disabled={isLoading || !password}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
                        >
                            {isLoading ? 'Verifying...' : 'Unlock'}
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-6">
                        All keys are encrypted with AES-256-GCM
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-900/30 rounded-lg">
                        <Key size={32} className="text-green-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-2">
                    Set Master Key
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                    Create a strong password to encrypt all your API keys
                </p>

                <div className="space-y-4">
                    {/* Warning */}
                    <div className="flex gap-2 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                        <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-200">
                            <strong>Important:</strong> You cannot recover this password. Write it down and store it safely.
                        </p>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Master Password
                        </label>
                        <input
                            type="password"
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setShowPasswordStrength(true);
                            }}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                            autoFocus
                        />

                        {/* Password Strength */}
                        {showPasswordStrength && password && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-gray-400">Strength:</span>
                                    <span className={`text-xs font-medium ${strength.color === 'bg-red-500' ? 'text-red-400' : strength.color === 'bg-yellow-500' ? 'text-yellow-400' : strength.color === 'bg-blue-500' ? 'text-blue-400' : 'text-green-400'}`}>
                                        {strength.label}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${strength.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(strength.score / 5) * 100}%` }}
                                    />
                                </div>
                                <ul className="text-xs text-gray-400 mt-2 space-y-1">
                                    <li>✓ At least 8 characters</li>
                                    <li className={password.length >= 12 ? 'text-green-400' : ''}>
                                        ✓ At least 12 characters (recommended)
                                    </li>
                                    <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-400' : ''}>
                                        ✓ Mix of uppercase and lowercase
                                    </li>
                                    <li className={/\d/.test(password) ? 'text-green-400' : ''}>✓ Numbers</li>
                                    <li className={/[^a-zA-Z\d]/.test(password) ? 'text-green-400' : ''}>
                                        ✓ Special characters (!@#$%^&*)
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                        />
                        {confirm && password !== confirm && (
                            <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg"
                        >
                            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </motion.div>
                    )}

                    <button
                        onClick={() => {
                            if (password !== confirm) {
                                alert('Passwords do not match');
                                return;
                            }
                            if (password.length < 8) {
                                alert('Password must be at least 8 characters');
                                return;
                            }
                            setMasterKey(password);
                        }}
                        disabled={isLoading || !password || password !== confirm || password.length < 8}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
                    >
                        {isLoading ? 'Setting up...' : 'Set Master Key'}
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-6">
                    Uses PBKDF2 (100,000 iterations) + AES-256-GCM encryption
                </p>
            </motion.div>
        </div>
    );
};
