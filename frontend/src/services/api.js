import axios from "axios";

// Shared Axios instance that sends cookies with every request
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;
