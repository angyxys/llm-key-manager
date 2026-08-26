import React, { useState } from 'react';
import { Folder as FolderIcon, Plus, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Folder } from '../types';
import { Modal } from './Modal';

interface FolderManagerProps {
  folders: Folder[];
  selectedFolderId?: string;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (name: string, description: string, color: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onUpdateFolder: (folderId: string, name: string, description: string, color: string) => void;
}

const folderColors = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
];

export const FolderManager: React.FC<FolderManagerProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onUpdateFolder,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDesc, setFolderDesc] = useState('');
  const [folderColor, setFolderColor] = useState('#3B82F6');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateOrUpdate = () => {
    if (!folderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    if (editingId) {
      onUpdateFolder(editingId, folderName, folderDesc, folderColor);
      setEditingId(null);
    } else {
      onCreateFolder(folderName, folderDesc, folderColor);
    }

    setFolderName('');
    setFolderDesc('');
    setFolderColor('#3B82F6');
    setShowModal(false);
    toast.success(editingId ? 'Folder updated' : 'Folder created');
  };

  const handleEdit = (folder: Folder) => {
    setEditingId(folder.id);
    setFolderName(folder.name);
    setFolderDesc(folder.description || '');
    setFolderColor(folder.color || '#3B82F6');
    setShowModal(true);
  };

  const handleDelete = (folderId: string) => {
    if (window.confirm('Delete this folder?')) {
      onDeleteFolder(folderId);
      if (selectedFolderId === folderId) {
        onSelectFolder(null);
      }
      toast.success('Folder deleted');
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded-lg transition"
      >
        <div className="flex items-center gap-2 text-gray-300">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <FolderIcon size={18} />
          <span className="font-medium">Folders</span>
          <span className="text-xs text-gray-500 ml-auto">{folders.length}</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1 pl-4"
          >
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => onSelectFolder(folder.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  selectedFolderId === folder.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="flex-1 text-sm truncate">{folder.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(folder);
                    }}
                    className="p-1 hover:bg-gray-600 rounded transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(folder.id);
                    }}
                    className="p-1 hover:bg-red-600 rounded transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}

            <button
              onClick={() => {
                setEditingId(null);
                setFolderName('');
                setFolderDesc('');
                setFolderColor('#3B82F6');
                setShowModal(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-blue-400 hover:bg-gray-700 rounded-lg transition text-sm"
            >
              <Plus size={16} />
              New Folder
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Folder' : 'Create Folder'}
        size="md"
        actions={
          <>
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateOrUpdate}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., Production Keys"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={folderDesc}
              onChange={(e) => setFolderDesc(e.target.value)}
              placeholder="Optional folder description"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <div className="grid grid-cols-7 gap-2">
              {folderColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setFolderColor(color.value)}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    folderColor === color.value ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
