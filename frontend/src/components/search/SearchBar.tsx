import React, { useState, useCallback, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'プロンプトを検索...',
  onSearch,
  className = '',
  autoFocus = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 検索クエリの処理を最適化するためにdebounceを使用
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (onSearch) {
        onSearch(query);
      }
    }, 300),
    [onSearch]
  );

  // 入力値の変更をハンドル
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // フォーム送信をハンドル
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 検索バーをクリア
  const handleClear = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${className}`}
    >
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          autoFocus={autoFocus}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiSearch size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;