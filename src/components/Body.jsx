import React, { useEffect, useState } from 'react'
import './Body.css'

const Body = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getProfiles() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.github.com/users?per_page=20');
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      const data = await response.json();
      setProfiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function searchUser(username) {
    if (!username.trim()) {
      getProfiles();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      setProfiles([data]);
    } catch (err) {
      setError(err.message);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    searchUser(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  useEffect(() => {
    getProfiles();
  }, []);

  if (loading) {
    return (
      <div className="body-container">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for a GitHub user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
              disabled
            />
            <button type="submit" className="search-button" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Search
            </button>
          </form>
          <button onClick={getProfiles} className="reset-button" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Show Popular Users
          </button>
        </div>
        <div className="loading">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="body-container">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for a GitHub user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Search
          </button>
        </form>
        <button onClick={getProfiles} className="reset-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Show Popular Users
        </button>
      </div>

      {error && (
        <div className="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {error}
        </div>
      )}

      <div className="profiles-grid">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="profile-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="profile-image">
              <img src={profile.avatar_url} alt={`${profile.login}'s avatar`} />
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{profile.login}</h3>
              {profile.name && <p className="profile-full-name">{profile.name}</p>}
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              <div className="profile-stats">
                {profile.public_repos !== undefined && (
                  <span className="stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <strong>{profile.public_repos}</strong> repos
                  </span>
                )}
                {profile.followers !== undefined && (
                  <span className="stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V16h-1.5v6h9zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-6H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v13h5.5z"/>
                    </svg>
                    <strong>{profile.followers}</strong> followers
                  </span>
                )}
                {profile.following !== undefined && (
                  <span className="stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V16h-1.5v6h9zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-6H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v13h5.5z"/>
                    </svg>
                    <strong>{profile.following}</strong> following
                  </span>
                )}
              </div>
              <a 
                href={profile.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="profile-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {profiles.length === 0 && !loading && !error && (
        <div className="no-results">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3>No profiles found</h3>
          <p>Try searching for a different username or browse popular users</p>
        </div>
      )}
    </div>
  )
}

export default Body
