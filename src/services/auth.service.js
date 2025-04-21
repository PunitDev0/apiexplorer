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

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Fetching current user failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
