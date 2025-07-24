import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.response?.data || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email, password) => api.post('/users/login', { email, password }),
  signup: (name, email, password) => api.post('/users/signup', { name, email, password }),
};

// Product services
export const productService = {
  getAllProducts: () => api.get('/products/getAll'),
  getProductById: (id) => api.get(`/products/getById/${id}`),
  createProduct: (product) => api.post('/products/create-product', product),
  updateProduct: (id, product) => api.put(`/products/update-product/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/delete-product/${id}`),
  reduceStock: (id, quantity) => api.post(`/products/reduce-stock/${id}`, { quantity }),
  getLowStockProducts: () => api.get('/products/low-stock'),
};

// Notification services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getUnreadNotifications: () => api.get('/notifications/unread'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export default api;