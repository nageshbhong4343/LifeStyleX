import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import API from '../services/api';
import './SearchPanel.css';

const SearchPanel = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await API.get(`/users/search?query=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-drawer">
      <div className="search-header">
        <h2>Search</h2>
        <div className="search-input-wrapper">
          <SearchIcon size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="clear-search-btn">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="search-results-list">
        {loading ? (
          <div className="search-msg">Searching...</div>
        ) : results.length > 0 ? (
          results.map((u) => (
            <Link key={u.id} to={`/profile/${u.username}`} onClick={onClose} className="search-result-item">
              <img src={u.avatar} alt={u.username} className="result-avatar" />
              <div className="result-info">
                <span className="result-username">{u.username}</span>
                <span className="result-fullname">{u.full_name}</span>
              </div>
            </Link>
          ))
        ) : query ? (
          <div className="search-msg">No results found.</div>
        ) : (
          <div className="search-msg">Type a name or username to search.</div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
