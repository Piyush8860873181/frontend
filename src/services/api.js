import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campuscycle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (localStorage.getItem('campuscycle_token')) {
        localStorage.removeItem('campuscycle_token');
        localStorage.removeItem('campuscycle_user');
        window.dispatchEvent(new Event('campuscycle_auth_change'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  verifyCollege: (data) => api.post('/auth/verify-college', data),
};

// Product Services
export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getHighlights: () => api.get('/products/homepage/highlights'),
  getMyListings: () => api.get('/products/my-listings'),
  createProduct: (formData) => {
    return api.post('/products', formData, {
      headers: { 'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json' },
    });
  },
  updateProduct: (id, formData) => {
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json' },
    });
  },
  updateStatus: (id, status) => api.patch(`/products/${id}/status`, { status }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Category Services
export const categoryService = {
  getCategories: () => api.get('/categories'),
};

// Wishlist Services
export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  getWishlistIds: () => api.get('/wishlist/ids'),
  toggleWishlist: (productId) => api.post(`/wishlist/toggle/${productId}`),
};

// Offer Services
export const offerService = {
  createOffer: (offerData) => api.post('/offers', offerData),
  getMyOffers: () => api.get('/offers'),
  respondToOffer: (id, responseData) => api.patch(`/offers/${id}/respond`, responseData),
};

// Message Services
export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
};

// Admin Services
export const adminService = {
  getMetrics: () => api.get('/admin/metrics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleSuspension: (userId) => api.patch(`/admin/users/${userId}/suspend`),
  createReport: (reportData) => api.post('/admin/reports', reportData),
  getReports: () => api.get('/admin/reports'),
  updateReport: (reportId, status) => api.patch(`/admin/reports/${reportId}`, { status }),
};

// Impact Services
export const impactService = {
  getImpactMetrics: () => api.get('/impact'),
};

export default api;
