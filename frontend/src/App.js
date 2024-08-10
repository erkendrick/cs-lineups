import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageContainer from './components/ImageContainer';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loginStatus, setLoginStatus] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_MAPS_ENDPOINT}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setMaps(data);
        })
        .catch((error) => {
          console.error('Error fetching maps:', error);
          setError(`Failed to fetch maps. ${error.message}`);
        });
    }
  }, [isAuthenticated]);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_LOGIN_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setIsAuthenticated(true);

        setLoginStatus('green');

      } else {
        console.error('Login failed: Incorrect username or password');
        setLoginStatus('red');
        setTimeout(() => {
          setLoginStatus('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginStatus('red');
      setTimeout(() => {
        setLoginStatus('');
      }, 5000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);

    setLoginStatus('');
  };

  const handleMapChange = (selectedMap) => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_IMAGES_ENDPOINT}/${selectedMap}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const processedImages = data.map(image => ({
          ...image,
          data: determineImageType(image.data)
        }));
        setImages(processedImages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
        setError('Failed to fetch images. Please try again.');
        setLoading(false);
      });
  };

  const determineImageType = (base64String) => {
    if (base64String.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${base64String}`;
    } else if (base64String.startsWith('R0lGODlh')) {
      return `data:image/gif;base64,${base64String}`;
    } else if (base64String.startsWith('iVBORw0KGgo')) {
      return `data:image/png;base64,${base64String}`;
    } else {
      return `data:image/jpeg;base64,${base64String}`;
    }
  };

  return (
    <div className="App">
      <Header 
        maps={maps} 
        onMapChange={handleMapChange} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        isAuthenticated={isAuthenticated}
        loginStatus={loginStatus} 
      />
      {isAuthenticated ? (
        <AdminDashboard token={token} onLogout={handleLogout} />
      ) : (
        <>
          {loading && <div className="image-container"><p>Loading...</p></div>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && <ImageContainer images={images} />}
        </>
      )}
    </div>
  );
}

export default App;
