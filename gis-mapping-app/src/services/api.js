import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const getAssets = () => API.get('/assets');
export const createAsset = (data) => API.post('/assets', data);
export const updateAsset = (id, data) => API.put(`/assets/${id}`, data);
export const deleteAsset = (id) => API.delete(`/assets/${id}`);
