import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const login = (form) => {
  return axios.post(`${API_BASE}/auth/login`, form);
};

export const register = (credentials) => {
  return axios.post(`${API_BASE}/auth/register`, credentials);
};
