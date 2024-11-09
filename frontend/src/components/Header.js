import React, { useState } from 'react';
import Login from './Login';

function Header({ maps, onMapChange, onLogin, onLogout, isAuthenticated, loginStatus }) {
  const [selectedMap, setSelectedMap] = useState('');

  const handleMapChange = (event) => {
    const map = event.target.value;
    setSelectedMap(map);
    onMapChange(map);
  };

  return (
    <header className="header">
      <div className="login-form">
        {isAuthenticated ? (
          <>
            <button onClick={onLogout}>Logout</button>
            <div className={`login-indicator ${loginStatus}`}></div>
          </>
        ) : (
          <>
            <Login onLogin={onLogin} />
            <div className={`login-indicator ${loginStatus}`}></div>
          </>
        )}
      </div>

      <div className="links">
        <a href="https://erkendrick.me" target="_blank" rel="noopener noreferrer">erkendrick.me</a>
        <span className="separator">|</span>
        <a href="https://github.com/erkendrick/cs-lineups/blob/master/backend/server.js" target="_blank" rel="noopener noreferrer">lineups.erkendrick.me/api</a>
      </div>

      <div className="map-selection">
        <select value={selectedMap} onChange={handleMapChange}>
          <option value="">Select a map</option>
          {maps.map((map, index) => (
            <option key={index} value={map.map}>
              {map.map}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default Header;
