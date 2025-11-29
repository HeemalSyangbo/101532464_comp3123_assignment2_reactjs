// src/api/axiosClient.js
import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:3000/api"; // fallback for local dev

const axiosClient = axios.create({
  baseURL,
});

// Attach token automatically for protected routes
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
