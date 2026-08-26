import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Provider, Tag, Folder } from '../types';

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  providers: Provider[];
  tags: Tag[];
  folders: Folder[];
}

interface SearchFilters {
  providers: Provider[];
  tags: string[];
  folders: string[];
  isFavorite?: boolean;
  hasNotes?: boolean;
  dateRange?: { from: Date; to: Date };
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  providers,
  tags,
  folders,
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    providers: [],
    tags: [],
    folders: [],
  });

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value, filters);
  };

  const toggleProvider = (provider: Provider) => {
    setFilters((prev) => ({
      ...prev,
      providers: prev.providers.includes(provider)
        ? prev.providers.filter((p) => p !== provider)
        : [...prev.providers, provider],
    }));
  };

  const toggleTag = (tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((t) => t !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const toggleFolder = (folderId: string) => {
    setFilters((prev) => ({
      ...prev,
      folders: prev.folders.includes(folderId)
        ? prev.folders.filter((f) => f !== folderId)
        : [...prev.folders, folderId],
    }));
  };

  const hasActiveFilters =
    filters.providers.length > 0 ||
    filters.tags.length > 0 ||
    filters.folders.length > 0 ||
    filters.isFavorite ||
    filters.hasNotes;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus-within:border-blue-500 focus-within:bg-gray-800">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search keys, names, notes..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded transition ${
              hasActiveFilters
                ? 'bg-blue-900/30 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Filters"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4"
          >
            {/* Providers Filter */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Providers</p>
              <div className="flex flex-wrap gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider}
                    onClick={() => toggleProvider(provider)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      filters.providers.includes(provider)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        filters.tags.includes(tag.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Folders Filter */}
            {folders.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Folders</p>
                <div className="flex flex-wrap gap-2">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => toggleFolder(folder.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        filters.folders.includes(folder.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: folder.color }}
                        />
                        {folder.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Additional Filters */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Options</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.isFavorite || false}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isFavorite: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Favorites only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasNotes || false}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasNotes: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Has notes</span>
                </label>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilters({
                    providers: [],
                    tags: [],
                    folders: [],
                  });
                  handleSearch(query);
                }}
                className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
