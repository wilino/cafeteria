/**
 * API Service
 * Centralized HTTP client with axios
 * Handles authentication, CSRF, and error responses
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Get CSRF token from cookie or localStorage
    const csrfToken = getCookie('csrf') || localStorage.getItem('csrfToken');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
};

// Users API
export const usersAPI = {
  getAll: (params) => apiClient.get('/users', { params }),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (userData) => apiClient.post('/users', userData),
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/${id}`),
  changePassword: (id, newPassword) => apiClient.post(`/users/${id}/change-password`, { newPassword }),
  getRoles: () => apiClient.get('/users/roles'),
};

// Ingredientes API
export const ingredientesAPI = {
  getAll: () => apiClient.get('/ingredientes'),
  getLowStock: () => apiClient.get('/ingredientes/low-stock'),
  getById: (id) => apiClient.get(`/ingredientes/${id}`),
  create: (data) => apiClient.post('/ingredientes', data),
  update: (id, data) => apiClient.put(`/ingredientes/${id}`, data),
  delete: (id) => apiClient.delete(`/ingredientes/${id}`),
  updateStock: (id, cantidad) => apiClient.patch(`/ingredientes/${id}/stock`, { cantidad }),
};

// Menu API
export const menuAPI = {
  getAll: () => apiClient.get('/menu'),
  getById: (id) => apiClient.get(`/menu/${id}`),
  create: (data) => apiClient.post('/menu', data),
  update: (id, data) => apiClient.put(`/menu/${id}`, data),
  delete: (id) => apiClient.delete(`/menu/${id}`),
  getIngredientes: (id) => apiClient.get(`/menu/${id}/ingredientes`),
  addIngrediente: (menuId, data) => apiClient.post(`/menu/${menuId}/ingredientes`, data),
  removeIngrediente: (menuId, ingredienteId) =>
    apiClient.delete(`/menu/${menuId}/ingredientes/${ingredienteId}`),
};

// Pedidos API
export const pedidosAPI = {
  getAll: (params) => apiClient.get('/pedidos', { params }),
  getById: (id) => apiClient.get(`/pedidos/${id}`),
  create: (data, idempotencyKey) =>
    apiClient.post('/pedidos', data, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }),
  updateEstado: (id, estado) => apiClient.patch(`/pedidos/${id}/estado`, { estado }),
  cancel: (id) => apiClient.post(`/pedidos/${id}/cancel`),
};

// MFA API
export const mfaAPI = {
  setup: () => apiClient.post('/mfa/setup'),
  enable: (token) => apiClient.post('/mfa/enable', { token }),
  disable: (token) => apiClient.post('/mfa/disable', { token }),
  getStatus: () => apiClient.get('/mfa/status'),
  verify: (token) => apiClient.post('/mfa/verify', { token }),
};

export default apiClient;
