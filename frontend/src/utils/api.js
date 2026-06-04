import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (name, code, type) =>
    api.post('/categories', { name, code, type }),
  delete: (id) =>
    api.delete(`/categories/${id}`)
};

export const transactionsAPI = {
  getAll: (startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return api.get('/transactions', { params });
  },
  create: (category_id, amount, type, description, date) =>
    api.post('/transactions', { category_id, amount, type, description, date }),
  delete: (id) =>
    api.delete(`/transactions/${id}`),
  getSummary: (date) =>
    api.get(`/transactions/summary/${date}`)
};

export default api;
