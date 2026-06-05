import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me')
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
