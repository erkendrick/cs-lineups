import React, { useState, useEffect } from 'react';
import './App.css';
import VerticalCarousel from './VerticalCarousel';
import Login from './Login';

function App() {
    const [images, setImages] = useState([]);
    const [maps, setMaps] = useState([]);
    const [selectedMap, setSelectedMap] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [newImage, setNewImage] = useState(null);
    const [newMap, setNewMap] = useState('');
    const [newCaption, setNewCaption] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(false);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/image-metadata.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {

                return JSON.parse(text);
            })
            .then(data => {
                if (Array.isArray(data)) {
                    const filteredImages = selectedMap ? data.filter(image => image.map === selectedMap) : data;
                    setImages(filteredImages);
                    const uniqueMaps = [...new Set(data.map(image => image.map))];
                    setMaps(uniqueMaps);
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching image metadata:', error));
    }, [selectedMap]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'L') {
                setShowLoginForm(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleLogin = (username, password) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        })
            .then(response => {
                console.log('Login response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Logged in:', data);
                setIsAuthenticated(true);
                setShowLoginForm(false);
            })
            .catch(error => console.error('Error logging in:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', newImage);
        formData.append('map', newMap);
        formData.append('caption', newCaption);

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/images/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Image uploaded:', data);
                setImages(prevImages => [...prevImages, data]);
                setMaps(prevMaps => [...new Set([...prevMaps, data.map])]);
            })
            .catch(error => console.error('Error uploading image:', error));
    };

    const handleDelete = () => {
        if (!selectedId) return;

        console.log(`Deleting image with ID: ${selectedId}`);

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/images/${selectedId}`, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(response => {
                console.log('Delete response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Image deleted:', data);
                setImages(prevImages => prevImages.filter(image => image.id !== selectedId));
                setMaps(prevMaps => prevMaps.filter(map => map !== data.map));
                setSelectedId('');
            })
            .catch(error => console.error('Error deleting image:', error));
    };

    const handleLogout = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Logged out successfully') {
                    setIsAuthenticated(false);
                    setShowLoginForm(false); 
                } else {
                    alert('Logout failed');
                }
            })
            .catch(error => console.error('Error logging out:', error));
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="header-left">
                    {isAuthenticated && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </div>
                <div className="header-center">
                    <select value={selectedMap} onChange={e => setSelectedMap(e.target.value)}>
                        <option value="">Select a Map</option>
                        {maps.map(map => (
                            <option key={map} value={map}>{map}</option>
                        ))}
                    </select>
                </div>
            </header>
            {showLoginForm && !isAuthenticated && (
                <div className="login-container"><Login onLogin={handleLogin} /></div>
            )}
            {isAuthenticated && (
                <div className="admin-controls">
                    <form onSubmit={handleSubmit}>
                        <input type="file" onChange={e => setNewImage(e.target.files[0])} required />
                        <input type="text" value={newMap} onChange={e => setNewMap(e.target.value)} placeholder="Map" required />
                        <input type="text" value={newCaption} onChange={e => setNewCaption(e.target.value)} placeholder="Caption" required />
                        <button type="submit">Upload Image</button>
                    </form>
                    <div>
                        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                            <option value="" disabled>Select image to delete</option>
                            {images.map(image => (
                                <option key={image.id} value={image.id}>{image.id}</option>
                            ))}
                        </select>
                        <button onClick={handleDelete}>Delete Image</button>
                    </div>
                </div>
            )}
            <VerticalCarousel images={images} />
        </div>
    );
}

export default App;
