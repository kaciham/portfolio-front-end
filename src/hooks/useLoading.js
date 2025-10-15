import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading states
 * @param {boolean} initialState - Initial loading state
 * @returns {Object} Loading state and control functions
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState('');

  const startLoading = useCallback((message = '') => {
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const toggleLoading = useCallback(() => {
    setIsLoading(prev => !prev);
  }, []);

  // Wrapper function to execute async operations with loading
  const withLoading = useCallback(async (asyncOperation, message = '') => {
    try {
      startLoading(message);
      const result = await asyncOperation();
      return result;
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading
  };
};

/**
 * Custom hook for managing multiple loading states
 * @returns {Object} Multiple loading states and control functions
 */
export const useMultipleLoading = () => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = useCallback((key, isLoading, message = '') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading, message }
    }));
  }, []);

  const startLoading = useCallback((key, message = '') => {
    setLoading(key, true, message);
  }, [setLoading]);

  const stopLoading = useCallback((key) => {
    setLoading(key, false, '');
  }, [setLoading]);

  const isLoading = useCallback((key) => {
    return loadingStates[key]?.isLoading || false;
  }, [loadingStates]);

  const getMessage = useCallback((key) => {
    return loadingStates[key]?.message || '';
  }, [loadingStates]);

  const withLoading = useCallback(async (key, asyncOperation, message = '') => {
    try {
      startLoading(key, message);
      const result = await asyncOperation();
      return result;
    } catch (error) {
      throw error;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    isLoading,
    getMessage,
    withLoading
  };
};

export default useLoading;