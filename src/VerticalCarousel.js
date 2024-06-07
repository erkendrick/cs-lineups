import React, { useRef, useEffect } from 'react';

const VerticalCarousel = ({ images }) => {
  const containerRef = useRef(null);
  const items = images.length === 1 ? images : [...images, ...images, ...images];

  useEffect(() => {
    const handleScroll = () => {
      const node = containerRef.current;
      if (!node) return;

      const { scrollTop, clientHeight, scrollHeight } = node;
      const threshold = clientHeight / 2;

      if (scrollTop < threshold) {
        node.scrollTop = scrollHeight / 3 + scrollTop;
      } else if (scrollTop > 2 * (scrollHeight / 3) - threshold) {
        node.scrollTop = scrollTop - scrollHeight / 3;
      }
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('scroll', handleScroll);
      setTimeout(() => {
        if (node) {
          node.scrollTop = node.scrollHeight / 3;
        }
      }, 0);

      return () => {
        if (node) {
          node.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="carousel-container">
      {items.map((img, index) => (
        <div key={index} className="carousel-item">
          <img src={`${process.env.PUBLIC_URL}${img.src}`} alt={img.caption} className="carousel-image"/>
          <figcaption>{img.caption}</figcaption>
        </div>
      ))}
    </div>
  );
};

export default VerticalCarousel;


