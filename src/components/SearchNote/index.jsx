import React from 'react';
import './style.css';

function SearchNote({ searchTerm, onChange }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="搜索笔记..."
        value={searchTerm}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchNote;
