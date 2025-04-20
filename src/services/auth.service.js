// frontend/services/authService.js
import axios from 'axios';
import { BASE_URL } from '@/lib/base_Url';

const API_URL = 'http://localhost:3001/auth';

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true // Important for cookies
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true // Important for cookies
    });
    return response.data;
  } catch (error) {
    console.error('Get user failed:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};