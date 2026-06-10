import axios from 'axios';

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

// Attach token to every request automatically
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('wk_access_token'); // matches tokenStore in api.js
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear(); // clear wk_access_token and wk_refresh_token
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default client;