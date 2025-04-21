// frontend/services/authService.js
import axios from 'axios';
import { BASE_URL } from '@/lib/base_Url';

// Only log BASE_URL in development mode
if (process.env.NODE_ENVI === 'development') {
  console.log('API BASE_URL:', BASE_URL);
}

const headers = {
  'Content-Type': 'application/json',
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
      headers,
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
      withCredentials: true, // Needed for cookie-based sessions
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Get the currently logged-in user
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      withCredentials: true, // Needed for cookie-based sessions
    });
    return response.data;
  } catch (error) {
    console.error('Fetching current user failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
