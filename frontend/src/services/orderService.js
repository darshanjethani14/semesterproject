import api from './api';

export const createOrder = (data) => api.post('/orders', data);
export const getUserOrders = () => api.get('/orders/user');
export const getAllOrders = () => api.get('/orders');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}`, { status });
export const getOrderAnalytics = () => api.get('/orders/analytics');
