import api from './api';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');
export const getUsers = () => api.get('/auth/users');
export const getWishlist = () => api.get('/auth/wishlist');
export const toggleWishlist = (productId) => api.post(`/auth/wishlist/${productId}`);
