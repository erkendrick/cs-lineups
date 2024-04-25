import React, { useRef, useState, useEffect } from 'react';

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const VerticalCarousel = ({ images }) => {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);

  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0); 
    }
    itemRefs.current = itemRefs.current.slice(0, images.length);
  }, [images.length, currentIndex]);

  useEffect(() => {
    if (images.length < 3 || isMobile()) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = itemRefs.current.findIndex(ref => ref === entry.target);
        if (entry.isIntersecting && index !== -1) {
          const direction = index === 2 ? 1 : index === 0 ? -1 : 0;
          if (direction !== lastDirection) {
            setCurrentIndex(prevIndex => (prevIndex + direction + images.length) % images.length);
            setLastDirection(direction); 
          }
        }
      });
    }, {
      root: containerRef.current,
      threshold: 0.66,
      rootMargin: "0px"
    });

    const children = containerRef.current ? containerRef.current.children : [];
    itemRefs.current.forEach((ref, idx) => {
      if (children[idx]) {
        observer.observe(children[idx]);
        itemRefs.current[idx] = children[idx];
      }
    });

    return () => {
      itemRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [images.length, currentIndex, lastDirection]);

  if (images.length < 3 || isMobile()) {
    return (
      <div className="carousel-container">
        {images.map((image) => (
          <div key={image.src} className="carousel-item">
            <img src={image.src} alt={image.label || 'Image'} className="carousel-image"/>
            <figcaption>{image.caption}</figcaption>
          </div>
        ))}
      </div>
    );
  }

  const getPrevIndex = () => (currentIndex - 1 + images.length) % images.length;
  const getNextIndex = () => (currentIndex + 1) % images.length;

  return (
    <div className="carousel-container" ref={containerRef}>
      {[getPrevIndex(), currentIndex, getNextIndex()].map((index, idx) => (
        index < images.length ? ( 
          <div key={images[index].src} className="carousel-item" ref={el => itemRefs.current[idx] = el}>
            <img src={images[index].src} alt={images[index].label || 'Image'} className="carousel-image"/>
            <figcaption>{images[index].caption}</figcaption>
          </div>
        ) : null
      ))}
    </div>
  );
};

export default VerticalCarousel;


