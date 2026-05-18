import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchFilter = ({ onSearch }) => {
  const [department, setDepartment] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(department);
  };

  const handleClear = () => {
    setDepartment('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
      <div className="search-controls">
        <div className="search-bar">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Filter by department…"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          {department && (
            <button type="button" onClick={handleClear} style={{background:'transparent',padding:'2px',color:'var(--text-muted)',border:'none'}}>
              <X size={14} />
            </button>
          )}
        </div>
        <button type="submit" className="btn-secondary">Search</button>
      </div>
    </form>
  );
};

export default SearchFilter;
