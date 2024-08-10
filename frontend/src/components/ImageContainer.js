import React from 'react';

function ImageContainer({ images }) {
  return (
    <div className="image-container">
      {images.map((image) => (
        <div key={image.id} className="image-item">
          <img 
            src={image.data} 
            alt={image.caption} 
          />
          <p>{image.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default ImageContainer;
