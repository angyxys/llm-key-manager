import React, { useState } from 'react';
import { Tag as TagIcon, Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Tag } from '../types';
import { Modal } from './Modal';

interface TagManagerProps {
  tags: Tag[];
  selectedTags: string[];
  onSelectTag: (tagId: string) => void;
  onCreateTag: (name: string, color: string) => void;
  onDeleteTag: (tagId: string) => void;
}

const tagColors = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
];

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  selectedTags,
  onSelectTag,
  onCreateTag,
  onDeleteTag,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3B82F6');

  const handleCreateTag = () => {
    if (!tagName.trim()) {
      toast.error('Tag name is required');
      return;
    }

    onCreateTag(tagName, tagColor);
    setTagName('');
    setTagColor('#3B82F6');
    setShowModal(false);
    toast.success('Tag created');
  };

  const handleDeleteTag = (tagId: string) => {
    if (window.confirm('Delete this tag?')) {
      onDeleteTag(tagId);
      toast.success('Tag deleted');
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
          <TagIcon size={18} />
          <span className="font-medium">Tags</span>
          <span className="text-xs text-gray-500 ml-auto">{tags.length}</span>
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
            {tags.length === 0 ? (
              <p className="text-xs text-gray-500 py-2">No tags yet</p>
            ) : (
              tags.map((tag) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-600'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => onSelectTag(tag.id)}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-sm truncate text-gray-300">{tag.name}</span>
                  {tag.count && (
                    <span className="text-xs text-gray-500">{tag.count}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTag(tag.id);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 rounded transition"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))
            )}

            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-blue-400 hover:bg-gray-700 rounded-lg transition text-sm mt-2"
            >
              <Plus size={16} />
              New Tag
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Tag"
        size="sm"
        actions={
          <>
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTag}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Create
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tag Name</label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., Production, Testing"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
            <div className="grid grid-cols-8 gap-2">
              {tagColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setTagColor(color.value)}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    tagColor === color.value ? 'ring-2 ring-white scale-110' : ''
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
