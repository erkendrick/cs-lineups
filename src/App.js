import React, { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import VerticalCarousel from './VerticalCarousel';
import { defaultImages, allImages } from './assets';

function App() {
  const [filteredImages, setFilteredImages] = useState(defaultImages);

  const handleFilter = (filtered) => {
    setFilteredImages(filtered);
  };

  return (
    <div className="App">
      <header className="App-header">
        <SearchBar images={allImages} defaultImages={defaultImages} onFilter={handleFilter} />
      </header>
      <VerticalCarousel images={filteredImages} />
    </div>
  );
}

export default App;
