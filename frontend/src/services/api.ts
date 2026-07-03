import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for sending secure HttpOnly cookies
});

// Response interceptor for handling global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Handle global logout or token refresh if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
