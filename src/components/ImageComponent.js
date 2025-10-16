// components/ImageComponent.js
import React, { useState, useRef, useEffect } from 'react';

const ImageComponent = ({ src, alt, className, title, onClick, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    console.warn(`Failed to load image: ${src}`);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && isInView && !hasError && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${className}`} aria-label="Image en cours de chargement" />
      )}
      {hasError && (
        <div className={`flex items-center justify-center bg-gray-100 text-gray-500 text-sm ${className}`}>
          Image indisponible
        </div>
      )}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt || 'Image'}
          title={title}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};

export default ImageComponent;
