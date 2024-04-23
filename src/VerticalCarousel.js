import React, { useState, useRef, useEffect, useCallback } from 'react';

const VerticalCarousel = ({ images }) => {
  const [carouselItems, setCarouselItems] = useState(images.map(img => ({
    ...img,
    isVisible: false
  })));
  const containerRef = useRef(null);

  useEffect(() => {

    setCarouselItems(images.map(img => ({
      ...img,
      isVisible: false  
    })));
  }, [images]);  

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || !container.firstChild) {
      return; 
    }
  
    const { scrollTop, scrollHeight, clientHeight } = container;
    const itemHeight = container.firstChild.clientHeight;
  
    if (scrollTop + clientHeight >= scrollHeight - itemHeight) {
      const newItems = [...carouselItems.slice(1), carouselItems[0]];
      setCarouselItems(newItems);
      setTimeout(() => { container.scrollTop = scrollTop - itemHeight; }, 0);
    } else if (scrollTop <= itemHeight) {
      const newItems = [carouselItems[carouselItems.length - 1], ...carouselItems.slice(0, -1)];
      setCarouselItems(newItems);
      setTimeout(() => { container.scrollTop = scrollTop + itemHeight; }, 0);
    }
  }, [carouselItems]);

  useEffect(() => {
    if (images.length > 2) {
      const container = containerRef.current;
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [images.length, handleScroll]);

  return (
    <div className="carousel-container" ref={containerRef}>
      {carouselItems.map((image, index) => (
        <div key={index} className="carousel-item">
          <img
            src={image.src}
            alt={image.label || 'Image'}
            className="carousel-image"
            data-id={image.id}
          />
          <figcaption>{image.caption}</figcaption>
        </div>
      ))}
    </div>
  );
};

export default VerticalCarousel;

