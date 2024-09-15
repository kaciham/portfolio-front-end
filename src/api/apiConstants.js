// Base API URL, can be configured via environment variables
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002/api';

// Endpoints
export const PORFOLIO_ENDPOINTS = {
  GET_USERS: `${API_BASE_URL}/users`,
  GET_USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  CREATE_USER: `${API_BASE_URL}/users`,
  UPDATE_USER: (id) => `${API_BASE_URL}/users/${id}`,
  DELETE_USER: (id) => `${API_BASE_URL}/users/${id}`,
};

export const POST_ENDPOINTS = {
  GET_POSTS: `${API_BASE_URL}/posts`,
  GET_POST_BY_ID: (id) => `${API_BASE_URL}/posts/${id}`,
  CREATE_POST: `${API_BASE_URL}/posts`,
  UPDATE_POST: (id) => `${API_BASE_URL}/posts/${id}`,
  DELETE_POST: (id) => `${API_BASE_URL}/posts/${id}`,
};


// export const 
// Other constants related to API
export const TIMEOUT = 10000; // 10 seconds
