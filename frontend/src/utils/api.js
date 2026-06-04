import axios from 'axios';

const API_BASE = '/api';

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
  register: (nome, email, senha) =>
    api.post('/auth/register', { nome, email, senha }),
  login: (email, senha) =>
    api.post('/auth/login', { email, senha })
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (nome, tipo) =>
    api.post('/categories', { nome, tipo }),
  delete: (id) =>
    api.delete(`/categories/${id}`)
};

export const transactionsAPI = {
  getAll: (data = null) =>
    api.get('/transactions', { params: { data } }),
  create: (categoryId, valor, descricao, data) =>
    api.post('/transactions', { categoryId, valor, descricao, data }),
  delete: (id) =>
    api.delete(`/transactions/${id}`)
};

export default api;
