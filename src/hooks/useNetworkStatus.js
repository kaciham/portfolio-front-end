import { useState, useEffect } from 'react';

/**
 * Custom hook to detect online/offline network status
 * @returns {boolean} isOnline - Current network status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Connection restored');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Network] Connection lost');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
