// src/services/authService.js
import axios from 'axios';
import API_URL from '../api';
 // Replace with your backend API

axios.defaults.withCredentials = true;

// Function to fetch CSRF token
const getCsrfToken = async () => {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`);
};


export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, userData);
    console.log('Registration response:', response);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => {
  // If using token-based authentication (like JWT or Sanctum), remove the token.
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};
