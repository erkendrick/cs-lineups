import React, { useEffect, useRef } from 'react';

const VerticalCarousel = ({ images }) => {
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const lastY = useRef(0);
  const velocity = useRef(0);
  const frameId = useRef(null);
  const isProgrammaticScroll = useRef(false); 

  useEffect(() => {
    if (images.length === 1) {
      return;
    }
    const handleScroll = () => {
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false; 
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = carouselRef.current;
      const bufferHeight = scrollHeight / 3;
      const LOWER_BOUND = 1 / 3;
      const UPPER_BOUND = 2 / 3;

      if (scrollTop + clientHeight >= scrollHeight * UPPER_BOUND) {
        isProgrammaticScroll.current = true; 
        carouselRef.current.scrollTop = scrollTop - bufferHeight;
      } else if (scrollTop <= scrollHeight * LOWER_BOUND) {
        isProgrammaticScroll.current = true; 
        carouselRef.current.scrollTop = scrollTop + bufferHeight;
      }
    };

    const mouseDownHandler = (e) => {
      if (e.button === 1) return;
      isDragging.current = true;
      lastY.current = e.clientY;
      velocity.current = 0;
      e.preventDefault();
    };

    const mouseMoveHandler = (e) => {
      if (!isDragging.current) return;
      const deltaY = e.clientY - lastY.current;
      isProgrammaticScroll.current = true; 
      carouselRef.current.scrollTop -= deltaY;
      velocity.current = deltaY;
      lastY.current = e.clientY;
    };

    const mouseUpHandler = (e) => {
      if (e.button === 1) return;  
      isDragging.current = false;  
      if (velocity.current) {
        initiateMomentum();  
      } else {
        isProgrammaticScroll.current = false;
        carouselRef.current.dispatchEvent(new Event('scroll'));
      }
    };

    const initiateMomentum = () => {
      const deceleration = 0.99;
      const momentum = () => {
        if (Math.abs(velocity.current) < 1) {
          isProgrammaticScroll.current = false; 
          carouselRef.current.dispatchEvent(new Event('scroll'));
          cancelAnimationFrame(frameId.current);
          return;
        }
        isProgrammaticScroll.current = true; 
        carouselRef.current.scrollTop -= velocity.current;
        velocity.current *= deceleration;
        frameId.current = requestAnimationFrame(momentum);
      };
      momentum();
    };
    
    const currentCarousel = carouselRef.current;
    currentCarousel.addEventListener('scroll', handleScroll);
    currentCarousel.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    return () => {
      currentCarousel.removeEventListener('scroll', handleScroll);
      currentCarousel.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [images.length]);

  const displayImages = images.length === 1 ? images : [...images, ...images, ...images];

  return (
    <div ref={carouselRef} className="carousel-container" style={{ overflowY: images.length === 1 ? 'hidden' : 'auto', maxHeight: '90vh' }}>
      {displayImages.map((image, index) => (
        <div key={index} className="carousel-item">
          <img src={image.src} alt={image.label || 'Image'} className="carousel-image" />
          <figcaption>{image.caption}</figcaption>
        </div>
      ))}
    </div>
  );
};

export default VerticalCarousel;

