import axios from 'axios';

// Prefer REACT_APP_API_BASE_URL, fallback to Vercel env var, then to same-origin
const baseURL = process.env.REACT_APP_API_BASE_URL || process.env.PUBLIC_URL || '';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Basic response error logging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response) {
      console.warn('API error:', err.response.status, err.response.data);
    } else {
      console.warn('Network/API error:', err.message);
    }
    return Promise.reject(err);
  }
);

export default api;
