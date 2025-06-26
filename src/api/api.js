import axios from "axios";
import { getToken } from "./auth";

// Create an Axios instance
const apiClient = axios.create({
  // baseURL: 'http://192.168.1.9:5000/api', //npm run dev -- --host
  // baseURL: "http://localhost:5294/api", // npm run dev
  baseURL:
    "https://vietan360backend-embufeb4fja7axf6.southeastasia-01.azurewebsites.net/api", // npm

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data from the response
  },
  (error) => {
    // Handle errors globally
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
