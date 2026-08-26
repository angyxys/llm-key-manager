import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: { provider?: string; tag?: string }) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterChange,
  placeholder = 'Search keys (Ctrl+K)...',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className={`relative flex items-center gap-3 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg transition-all ${
        isFocused ? 'border-blue-500 bg-gray-800 shadow-lg shadow-blue-500/20' : ''
      }`}>
        <Search size={18} className="text-gray-400" />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        <span className="text-xs text-gray-500 ml-2">
          {query ? `${query.length} chars` : 'Ctrl+K'}
        </span>
      </div>
    </div>
  );
};
