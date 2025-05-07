
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from localStorage with correct key
    const token = localStorage.getItem('access');
    
    if (token) {
      // Check if token is expired
      const decodedToken = jwtDecode(token) as { exp: number };
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token is expired, try to refresh
        try {
          const refreshToken = localStorage.getItem('refresh');
          if (refreshToken) {
            const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
              refresh: refreshToken,
            });
            
            // Save the new access token with correct key
            localStorage.setItem('access', response.data.access);
            
            // Add token to request header
            config.headers.Authorization = `Bearer ${response.data.access}`;
          } else {
            // No refresh token, redirect to login
            window.location.href = '/login';
          }
        } catch (error) {
          // Refresh token failed, redirect to login
          console.error('Failed to refresh token:', error);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      } else {
        // Token is valid, add to header
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, clear tokens and redirect to login
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
