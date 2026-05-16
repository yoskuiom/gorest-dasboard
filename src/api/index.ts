import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gorest.co.in/public/v2',
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gorest-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('gorest_token'); 
      // window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default api;