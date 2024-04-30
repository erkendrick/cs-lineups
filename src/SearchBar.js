import React, { useState } from 'react';

function SearchBar({ images, onFilter, defaultImages }) {
    const [input, setInput] = useState('');

    const handleChange = (event) => {
        const value = event.target.value.toLowerCase();
        setInput(value);

        if (!value.trim()) {
            onFilter(defaultImages);
            return;
        }

        const terms = value.split(/\s+/);
        const mapTerms = [], locationTerms = [], utilityTerms = [], categoryTerms = [];
        terms.forEach(term => {
            if (images.some(img => img.map.toLowerCase() === term)) {
                mapTerms.push(term);
            } else if (images.some(img => img.location.toLowerCase() === term)) {
                locationTerms.push(term);
            } else if (images.some(img => img.utility.toLowerCase() === term)) {
                utilityTerms.push(term);
            } else {
                categoryTerms.push(term); 
            }
        });

        const filteredImages = images.filter(image => {
            const mapMatch = !mapTerms.length || mapTerms.some(t => image.map.toLowerCase().includes(t));
            const locationMatch = !locationTerms.length || locationTerms.some(t => image.location.toLowerCase().includes(t));
            const utilityMatch = !utilityTerms.length || utilityTerms.some(t => image.utility.toLowerCase().includes(t));
            const categoryMatch = !categoryTerms.length || categoryTerms.some(t => image.category.toLowerCase().includes(t));
            return mapMatch && locationMatch && utilityMatch && categoryMatch;
        });

        onFilter(filteredImages);
    };

    return (
        <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Search for lineups..."
            className="search-input"
        />
    );
}

export default SearchBar;