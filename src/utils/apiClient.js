import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "https://craftsales-online.onrender.com",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response error logging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response) {
      console.warn("API error:", err.response.status, err.response.data);
    } else {
      console.warn("Network/API error:", err.message);
    }
    return Promise.reject(err);
  }
);

export default api;
