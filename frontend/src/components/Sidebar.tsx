import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Key, Settings, LogOut, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Tag } from '../types';
import { FolderManager } from './FolderManager';
import { TagManager } from './TagManager';

interface SidebarProps {
  onLogout?: () => void;
  masterKeyStatus?: string;
  folders?: Folder[];
  tags?: Tag[];
  onSelectFolder?: (folderId: string | null) => void;
  onCreateFolder?: (name: string, desc: string, color: string) => void;
  onDeleteFolder?: (id: string) => void;
  onUpdateFolder?: (id: string, name: string, desc: string, color: string) => void;
  onSelectTag?: (tagId: string) => void;
  onCreateTag?: (name: string, color: string) => void;
  onDeleteTag?: (id: string) => void;
  selectedFolderId?: string;
  selectedTags?: string[];
}

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/keys', icon: Key, label: 'API Keys' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  masterKeyStatus,
  folders = [],
  tags = [],
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onUpdateFolder,
  onSelectTag,
  onCreateTag,
  onDeleteTag,
  selectedFolderId,
  selectedTags = [],
}) => {
  const location = useLocation();
  const [showFolders, setShowFolders] = useState(true);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-bold text-lg truncate">LLM Keys</h1>
            <p className="text-xs text-gray-400">v2.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="h-px bg-gray-800 my-4" />

        {/* Folders */}
        {folders && folders.length > 0 && onSelectFolder && (
          <FolderManager
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={onSelectFolder}
            onCreateFolder={onCreateFolder || (() => {})}
            onDeleteFolder={onDeleteFolder || (() => {})}
            onUpdateFolder={onUpdateFolder || (() => {})}
          />
        )}

        {/* Tags */}
        {tags && tags.length > 0 && onSelectTag && (
          <div className="mt-6">
            <TagManager
              tags={tags}
              selectedTags={selectedTags}
              onSelectTag={onSelectTag}
              onCreateTag={onCreateTag || (() => {})}
              onDeleteTag={onDeleteTag || (() => {})}
            />
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-3 flex-shrink-0">
        <div className="px-4 py-3 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Master Key Status</p>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                masterKeyStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className="text-sm text-gray-300 font-medium capitalize">
              {masterKeyStatus === 'verified' ? 'Protected' : masterKeyStatus || 'Locked'}
            </span>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-900/30 hover:text-red-400 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        )}
      </div>
    </motion.aside>
  );
};
