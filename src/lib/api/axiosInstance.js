import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — har request ke sath token attach karo
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ⬅️ neeche note dekho
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;