import React, { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import VerticalCarousel from './VerticalCarousel';
import images from './assets';

function App() {
  const [filteredImages, setFilteredImages] = useState(images);

  const handleFilter = (filtered) => {
    setFilteredImages(filtered);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Counter-Strike Lineups</h1>
        <SearchBar images={images} onFilter={handleFilter} />
      </header>
      <VerticalCarousel images={filteredImages} />
    </div>
  );
}

export default App;
