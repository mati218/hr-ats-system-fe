import axios from "axios";

const api = axios.create({
  baseURL: "https://atlas-reptilian-covenant.ngrok-free.dev/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});
export default api;
