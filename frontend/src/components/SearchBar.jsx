import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, onClear, skillFilter, onClearSkillFilter }) {
    const [query, setQuery] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onSearch(query);
    }

    function handleClear() {
        setQuery('');
        onClear();
    }

    return (
        <div className="search-section">
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search projects, skills, or anything..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button type="button" className="search-clear" onClick={handleClear}>
                            ✕
                        </button>
                    )}
                </div>
                <button type="submit" className="btn btn-primary search-btn">
                    Search
                </button>
            </form>

            {skillFilter && (
                <div className="active-filter">
                    <span>Filtering by skill:</span>
                    <span className="tag active">
                        {skillFilter}
                        <button onClick={onClearSkillFilter} className="filter-clear">✕</button>
                    </span>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
