import axios from 'axios';

const apiUrl = process.env.REACT_APP_SERVER_PROD;

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || apiUrl,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;