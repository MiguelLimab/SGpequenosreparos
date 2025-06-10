import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // se estiver usando cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou de onde estiver armazenando
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
