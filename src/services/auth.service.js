import axios from 'axios';
import { BASE_URL } from '@/lib/base_Url';

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
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
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    if (!isProduction) {
      console.error('Registration failed:', errorMessage);
    }
    throw new Error(errorMessage);
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
    const errorMessage = error.response?.data?.message || 'Login failed';
    if (!isProduction) {
      console.error('Login failed:', errorMessage);
    }
    throw new Error(errorMessage);
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
    const errorMessage = error.response?.data?.message || 'Failed to fetch user data';
    if (!isProduction) {
      console.error('Get user failed:', errorMessage);
    }
    throw new Error(errorMessage);
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Logout failed';
    if (!isProduction) {
      console.error('Logout failed:', errorMessage);
    }
    throw new Error(errorMessage);
  }
};