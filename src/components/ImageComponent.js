// components/ImageComponent.js
import React, { useState, useRef, useEffect } from 'react';

const ImageComponent = ({ src, alt, className, title, onClick, fallbackSrc, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
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

  // Reset states when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${currentSrc}`);
    
    // Try fallback image if provided and we haven't already tried it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoaded(false);
      return;
    }
    
    // If no fallback or fallback also failed, show error state
    setHasError(true);
    setIsLoaded(false);
  };

  const getPlaceholderContent = () => {
    // For skill logos, show a generic tech icon
    if (alt && alt.includes('Compétence technique')) {
      return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 ${className}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    // Default placeholder
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-500 text-sm ${className}`}>
        Image indisponible
      </div>
    );
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && isInView && !hasError && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${className}`} aria-label="Image en cours de chargement" />
      )}
      {hasError && getPlaceholderContent()}
      {isInView && !hasError && (
        <img
          src={currentSrc}
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
