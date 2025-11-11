import axiosInstance from './axiosInstance';

// API call wrapper with loading state management
export const apiCall = async (config, onLoadingChange = null) => {
  try {
    if (onLoadingChange) onLoadingChange(true);

    const response = await axiosInstance(config);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API call error:', error);

    // Use custom error message from interceptor if available
    const errorMessage = error.customMessage ||
                         error.response?.data?.message ||
                         error.message ||
                         'An error occurred. Please try again.';

    return {
      data: null,
      error: errorMessage
    };
  } finally {
    if (onLoadingChange) onLoadingChange(false);
  }
};

// Get user data
export const getUserData = async (onLoadingChange = null) => {
  return await apiCall({
    method: 'GET',
    url: '/api/kaci'
  }, onLoadingChange);
};

// Send contact form
export const sendContactForm = async (formData, onLoadingChange = null) => {
  return await apiCall({
    method: 'POST',
    url: '/api/contacts',
    data: formData,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }, onLoadingChange);
};

// Generic loading wrapper for any async function
export const withLoading = async (asyncFunction, setLoading) => {
  try {
    setLoading(true);
    return await asyncFunction();
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};