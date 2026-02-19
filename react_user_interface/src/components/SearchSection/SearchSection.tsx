import { type FC, type KeyboardEvent } from 'react';
import './SearchSection.css';

interface SearchSectionProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
}

export const SearchSection: FC<SearchSectionProps> = ({ value, onChange, onSearch }) => {
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="search-section">
      <div className="search-form">
        <input
          type="text"
          placeholder="Поиск княжества..."
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};