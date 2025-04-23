import axios from 'axios';
import { BASE_URL } from '@/lib/base_Url';

if (process.env.NODE_ENV === 'development') {
  console.log('API BASE_URL:', BASE_URL);
}

// Common headers
const headers = {
  'Content-Type': 'application/json',
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials, {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Get current user with enhanced error handling
export const getCurrentUser = async () => {
  try {
    // Make the request to the backend to get the current user
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      withCredentials: true, // Ensure cookies are included in the request automatically
    });

    // Check if the response was successful and return the user data
    if (response && response.data) {
      return response.data;
    } else {
      // If there's no response data, throw an error
      throw new Error('No data received from the server');
    }
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      // Handle API errors (e.g., status codes 4xx, 5xx)
      console.error('Error Response:', error.response);
      // Handle specific API error response
      if (error.response.status === 401) {
        // For unauthorized, provide more context
        console.error('User is not authenticated or session has expired');
      }
      return error.response?.data || { message: 'Error fetching user data' };
    } else if (error.request) {
      // Handle network errors or no response from server
      console.error('No response received:', error.request);
      return { message: 'Network error, please try again later' };
    } else {
      // For any other errors
      console.error('Error:', error.message);
      return { message: 'An error occurred, please try again later' };
    }
  }
};

