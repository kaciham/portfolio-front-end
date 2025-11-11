import axios from 'axios';

const apiUrl = process.env.REACT_APP_SERVER_PROD;

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || apiUrl,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging and modifications
axiosInstance.interceptors.request.use(
    (config) => {
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and retry logic
axiosInstance.interceptors.response.use(
    (response) => {
        // Log successful response in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if network error (no response from server)
        if (!error.response) {
            console.error('[Network Error] No response from server:', error.message);

            // Retry logic for network errors
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

                // Retry up to 3 times with exponential backoff
                if (originalRequest._retryCount <= 3) {
                    const delay = Math.pow(2, originalRequest._retryCount) * 1000; // 2s, 4s, 8s
                    console.log(`[Retry] Attempt ${originalRequest._retryCount}/3 in ${delay}ms`);

                    await new Promise(resolve => setTimeout(resolve, delay));
                    return axiosInstance(originalRequest);
                }
            }

            // Add custom error message for network failures
            error.customMessage = 'Unable to connect to server. Please check your internet connection.';
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            error.customMessage = 'Request timed out. Please try again.';
        }

        // Handle specific HTTP status codes
        if (error.response) {
            const status = error.response.status;

            switch (status) {
                case 400:
                    error.customMessage = 'Invalid request. Please check your input.';
                    break;
                case 401:
                    error.customMessage = 'Unauthorized. Please log in again.';
                    break;
                case 403:
                    error.customMessage = 'Access forbidden.';
                    break;
                case 404:
                    error.customMessage = 'Resource not found.';
                    break;
                case 500:
                    error.customMessage = 'Server error. Please try again later.';
                    break;
                case 502:
                case 503:
                case 504:
                    error.customMessage = 'Service temporarily unavailable. Please try again later.';
                    break;
                default:
                    error.customMessage = error.response.data?.message || 'An error occurred. Please try again.';
            }
        }

        console.error('[API Error]', error.customMessage || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;