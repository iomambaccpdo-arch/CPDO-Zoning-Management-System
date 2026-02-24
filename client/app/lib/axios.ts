import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // We don't automatically call csrf-cookie here because it's better to explicitly call it before login.
    // However, we could add logic to check if we are making a mutating request.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
