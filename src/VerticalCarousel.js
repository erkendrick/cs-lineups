import React, { useRef, useEffect } from 'react';

const VerticalCarousel = ({ images }) => {
  const containerRef = useRef(null);
  const items = [...images, ...images, ...images];

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
          <img src={img.src} alt={img.caption} className="carousel-image"/>
          <figcaption>{img.caption}</figcaption>
        </div>
      ))}
    </div>
  );
};

export default VerticalCarousel;




// import React, { useRef, useState, useEffect, useCallback } from 'react';

// const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// const VerticalCarousel = ({ images }) => {
//   const containerRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const observerGate = useRef(false);

//   const getPrevIndex = useCallback(() => (currentIndex - 1 + images.length) % images.length, [currentIndex, images.length]);
//   const getNextIndex = useCallback(() => (currentIndex + 1) % images.length, [currentIndex, images.length]);
  
//   useEffect(() => {
//     if (!isMobile()) return;

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (observerGate.current) return;

//         if (entry.isIntersecting) {
//           const index = Array.from(containerRef.current.children).indexOf(entry.target);
//           observerGate.current = true;
//           setTimeout(() => observerGate.current = false, 50);
//           if (index === 0) {
//             setCurrentIndex(getPrevIndex);
//           } else if (index === 2) {
//             setCurrentIndex(getNextIndex);
//           }
//         }
//       });
//     }, { root: containerRef.current, threshold: 0.5 });

//     const itemRefs = containerRef.current.children;
//     Array.from(itemRefs).forEach(ref => observer.observe(ref));

//     return () => {
//       observer.disconnect();
//       Array.from(itemRefs).forEach(ref => observer.unobserve(ref));
//     };
//   }, [getPrevIndex, getNextIndex]);  
  
//   useEffect(() => {
//     if (isMobile()) return;

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (observerGate.current) return;

//         if (entry.isIntersecting) {
//           const index = Array.from(containerRef.current.children).indexOf(entry.target);
//           observerGate.current = true;
//           setTimeout(() => observerGate.current = false, 50);
//           if (index === 0) {
//             setCurrentIndex(getPrevIndex);
//           } else if (index === 2) {
//             setCurrentIndex(getNextIndex);
//           }
//         }
//       });
//     }, { root: containerRef.current, threshold: 0.25 });

//     const itemRefs = containerRef.current.children;
//     Array.from(itemRefs).forEach(ref => observer.observe(ref));

//     return () => {
//       observer.disconnect();
//       Array.from(itemRefs).forEach(ref => observer.unobserve(ref));
//     };
//   }, [getPrevIndex, getNextIndex]); 

//   return (
//     <div className="carousel-container" ref={containerRef}>
//       {[getPrevIndex(), currentIndex, getNextIndex()].map((index, idx) => (
//         <div key={`${index}-${images[index].src}`} className={`carousel-item ${idx === 0 ? 'prev' : idx === 1 ? 'current' : 'next'}`}>
//           <img src={images[index].src} alt={images[index].alt || 'Image'} className="carousel-image"/>
//           <figcaption>{images[index].caption}</figcaption>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default VerticalCarousel;


// import React, { useRef, useState, useEffect } from 'react';

// const VerticalCarousel = ({ images }) => {
//   const containerRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const observerGate = useRef(false);

//   useEffect(() => {
//     const itemRefs = Array.from(containerRef.current.children);

//     const observer = new IntersectionObserver((entries) => {
//       if (observerGate.current) return;
//       entries.forEach(entry => {
//         const index = itemRefs.indexOf(entry.target);
//         if (entry.isIntersecting) {
//           observerGate.current = true;
//           setTimeout(() => observerGate.current = false, 25);
//           if (index === 0) { // prev
//             setCurrentIndex(i => (i - 1 + images.length) % images.length);
//           } else if (index === 2) { // next
//             setCurrentIndex(i => (i + 1) % images.length);
//           }
//         }
//       });
//     }, { threshold: 0.5 });

//     itemRefs.forEach(ref => observer.observe(ref));

//     return () => {
//       observer.disconnect();
//       itemRefs.forEach(ref => observer.unobserve(ref));
//     };
//   }, [images.length, currentIndex]);  

//   const getPrevIndex = () => (currentIndex - 1 + images.length) % images.length;
//   const getNextIndex = () => (currentIndex + 1) % images.length;

//   return (
//     <div className="carousel-container" ref={containerRef}>
//       {[getPrevIndex(), currentIndex, getNextIndex()].map((index) => (
//         <div key={images[index].src} className="carousel-item">
//           <img src={images[index].src} alt={images[index].label || 'Image'} className="carousel-image"/>
//           <figcaption>{images[index].caption}</figcaption>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default VerticalCarousel;



// import React, { useRef, useState, useEffect } from 'react';

// const VerticalCarousel = ({ images }) => {
//   const containerRef = useRef(null);
//   const itemRefs = useRef([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [lastDirection, setLastDirection] = useState(null);

//   const currentIndexRef = useRef(currentIndex);
//   currentIndexRef.current = currentIndex;
//   const lastDirectionRef = useRef(lastDirection);
//   lastDirectionRef.current = lastDirection;

//   useEffect(() => {
//     if (currentIndex >= images.length) {
//       setCurrentIndex(0); 
//     }
//     itemRefs.current = itemRefs.current.slice(0, images.length);
//   }, [images.length, currentIndex]);

//   useEffect(() => {
//     if (images.length < 3) return;
    
  
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         const index = itemRefs.current.findIndex(ref => ref === entry.target);
//         if (entry.isIntersecting && index !== -1) {
//           const direction = index === 2 ? 1 : index === 0 ? -1 : 0;
//           if (direction !== lastDirectionRef.current) {
//             setCurrentIndex(prevIndex => (prevIndex + direction + images.length) % images.length);
//             setLastDirection(direction); 
//           }
//         }
//       });
//     }, {
//       threshold: 0.55,
      
//     });
  
//     const children = containerRef.current ? Array.from(containerRef.current.children) : [];
//     itemRefs.current.forEach((ref, idx) => {
//       if (children[idx]) {
//         observer.observe(children[idx]);
//         itemRefs.current[idx] = children[idx];
//       }
//     });
  
//     return () => {
//       itemRefs.current.forEach(ref => {
//         if (ref) observer.unobserve(ref);
//       });
//       observer.disconnect();
//     };
//   }, [images.length, currentIndex, lastDirection]);

//   if (images.length < 3) {
//     return (
//       <div className="carousel-container">
//         {images.map((image) => (
//           <div key={image.src} className="carousel-item">
//             <img src={image.src} alt={image.label || 'Image'} className="carousel-image"/>
//             <figcaption>{image.caption}</figcaption>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   const getPrevIndex = () => (currentIndex - 1 + images.length) % images.length;
//   const getNextIndex = () => (currentIndex + 1) % images.length;

//   return (
//     <div className="carousel-container" ref={containerRef}>
//       {[getPrevIndex(), currentIndex, getNextIndex()].map((index, idx) => (
//         index < images.length ? ( 
//           <div key={images[index].src} className="carousel-item" ref={el => itemRefs.current[idx] = el}>
//             <img src={images[index].src} alt={images[index].label || 'Image'} className="carousel-image"/>
//             <figcaption>{images[index].caption}</figcaption>
//           </div>
//         ) : null
//       ))}
//     </div>
//   );
// };

// export default VerticalCarousel;


/*
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
*/