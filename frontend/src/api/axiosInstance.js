import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
  headers: {
    "Content-Type": "application/json",
  }, // Your backend URL
  withCredentials: true, // Include cookies (for authentication if needed)
});

export default axiosInstance;
