import React, { useState, useEffect, useCallback } from 'react';

function AdminDashboard({ token, onLogout }) {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [caption, setCaption] = useState('');
  const [map, setMap] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  // Memoized fetchEntries function
  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_ENTRIES_ENDPOINT}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }, [token]);

  // Fetch entries on component load
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_ENTRIES_ENDPOINT}/${selectedId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setMessage('Entry deleted successfully');
        fetchEntries();
      } else {
        setMessage('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('map', map);
    formData.append('image', image);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_ENTRIES_ENDPOINT}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setMessage('Entry added successfully');
        fetchEntries();
        setCaption('');
        setMap('');
        setImage(null);
      } else {
        setMessage('Failed to add entry');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="message-container">
        <p>{message}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Caption</th>
            <th>Map</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.id}
              onClick={() => setSelectedId(entry.id)}
              style={{ backgroundColor: selectedId === entry.id ? '#ddd' : '' }}
            >
              <td>{entry.id}</td>
              <td>{entry.caption}</td>
              <td>{entry.map}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleDelete}>Delete Selected Entry</button>

      <h3>Add New Entry</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          required
        />
        <input
          type="text"
          value={map}
          onChange={(e) => setMap(e.target.value)}
          placeholder="Map"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}

export default AdminDashboard;
