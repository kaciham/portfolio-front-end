import React from 'react';
import Loader from './Loader';

/**
 * LoadingWrapper Component
 * Wraps content with loading state management
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.loadingMessage - Message to display while loading
 * @param {string} props.loaderType - Type of loader ('spinner', 'dots', 'pulse', 'default')
 * @param {string} props.loaderSize - Size of loader ('small', 'medium', 'large')
 * @param {string} props.loaderColor - Color of loader ('blue', 'white', 'gray')
 * @param {React.ReactNode} props.children - Content to render when not loading
 * @param {React.ReactNode} props.fallback - Custom loading fallback component
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.minHeight - Minimum height for loading container
 * @param {boolean} props.overlay - Whether to show as overlay
 */
const LoadingWrapper = ({
  isLoading,
  loadingMessage = 'Chargement en cours...',
  loaderType = 'spinner',
  loaderSize = 'medium',
  loaderColor = 'blue',
  children,
  fallback,
  className = '',
  minHeight = 'min-h-[200px]',
  overlay = false
}) => {
  if (isLoading) {
    const loadingContent = fallback || (
      <div className={`flex flex-col items-center justify-center ${minHeight} ${className}`}>
        <Loader type={loaderType} size={loaderSize} color={loaderColor} />
        {loadingMessage && (
          <p className="mt-4 text-center text-gray-600 animate-pulse">
            {loadingMessage}
          </p>
        )}
      </div>
    );

    if (overlay) {
      return (
        <div className="relative">
          {children}
          <div className="loading-overlay">
            {loadingContent}
          </div>
        </div>
      );
    }

    return loadingContent;
  }

  return children;
};

export default LoadingWrapper;