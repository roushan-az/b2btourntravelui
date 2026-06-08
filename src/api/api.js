import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});

// Helper to handle API calls
export const getDestinations = () => api.get('/destinations');
export const getHotels = () => api.get('/hotels');
export const createQuotation = (data) => api.post('/quotations', data);

export default api;