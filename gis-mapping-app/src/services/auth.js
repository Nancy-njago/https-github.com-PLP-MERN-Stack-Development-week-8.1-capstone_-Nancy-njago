import axios from 'axios';

export const login = (credentials) => axios.post('/api/auth/login', credentials);
export const register = (credentials) => axios.post('/api/auth/register', credentials);
