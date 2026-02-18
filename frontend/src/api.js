import axios from "axios";
import { getToken } from "./auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({ baseURL });

// Attach JWT to every request (if present)
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;