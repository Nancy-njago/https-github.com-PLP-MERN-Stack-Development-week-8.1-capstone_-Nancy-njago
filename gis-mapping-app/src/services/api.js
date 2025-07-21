import axios from 'axios';


const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});


export const getAssets = () => API.get('/assets');
export const createAsset = (data) => API.post('/assets', data);
export const deleteAsset = (id) => API.delete(`/assets/${id}`);
export const updateAsset = (id, data) => {
  return axios.put(`/api/assets/${id}`, data);
};

