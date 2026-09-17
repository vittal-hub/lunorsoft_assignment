import axios from "axios";

// Shared Axios instance that sends cookies with every request
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Turn a backend error response into a single readable message.
// Backend validation errors look like: { message, errors: [{ field, message }] }
export const getErrorMessage = (err, fallback) => {
  const data = err.response?.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message).join(", ");
  }
  return data?.message || fallback;
};

export default api;
