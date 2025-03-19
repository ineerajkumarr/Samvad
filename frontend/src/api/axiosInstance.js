import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  }, // Your backend URL
  withCredentials: true, // Include cookies (for authentication if needed)
});

export default axiosInstance;
