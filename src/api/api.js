import axios from 'axios';
import { getToken } from './auth';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:5294/api', // Replace with your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add a response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response.data; // Return only the data from the response
    },
    (error) => {
        // Handle errors globally
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;