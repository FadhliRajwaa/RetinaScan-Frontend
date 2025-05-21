import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const register = async (userData) => {
  try {
    console.log('Mengirim permintaan registrasi ke:', `${API_URL}/api/auth/register`);
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    console.log('Respons registrasi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registrasi error:', error.response || error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    console.log('Login API response:', response.data);
    
    // Pastikan respons mengandung token
    if (!response.data || !response.data.token) {
      throw new Error('Token tidak ditemukan dalam respons server');
    }
    
    return response.data; // Mengembalikan { token, user }
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (resetCode, password) => {
  const response = await axios.post(`${API_URL}/api/auth/reset-password`, { resetCode, password });
  return response.data;
};