import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const method = config.method?.toUpperCase() || 'UNKNOWN';
  const url = config.url || 'Unknown';

  console.log(`
┌─────────────────────────────────────┐
│        API REQUEST INITIATED        │
├─────────────────────────────────────┤
│ Method: ${method.padEnd(27)} │
│ URL: ${url.substring(0, 31).padEnd(31)} │
│ Timestamp: ${new Date().toISOString().padEnd(28)} │
└─────────────────────────────────────┘
  `);
  return config;
});

api.interceptors.response.use(
  (res) => {
    const url = res.config?.url || 'Unknown';

    console.log(`
┌─────────────────────────────────────┐
│        API RESPONSE RECEIVED        │
├─────────────────────────────────────┤
│ Status: ${String(res.status).padEnd(30)} │
│ URL: ${url.substring(0, 31).padEnd(31)} │
│ Timestamp: ${new Date().toISOString().padEnd(28)} │
└─────────────────────────────────────┘
    `);
    return res;
  },
  (error) => {
    const status = error.response?.status;
    let message = error.response?.data?.message || error.message || 'Unknown error';
    if (typeof message !== 'string') {
      try {
        message = JSON.stringify(message);
      } catch {
        message = String(message);
      }
    }
    const timestamp = new Date().toISOString();
    const url = error.config?.url || 'Unknown';
    const method = error.config?.method?.toUpperCase() || 'Unknown';
    const requestData = error.config?.data ? JSON.stringify(error.config.data) : 'None';

    console.error(`
╔════════════════════════════════════════╗
║           API ERROR OCCURRED           ║
╚════════════════════════════════════════╝
┌─ ERROR DETAILS ─────────────────────────┐
│ Status: ${String(status || 'Network Error').padEnd(33)} │
│ Message: ${message.substring(0, 30).padEnd(30)} │
│ URL: ${url.substring(0, 28).padEnd(30)} │
│ Method: ${method.padEnd(30)} │
│ Timestamp: ${timestamp.padEnd(28)} │
├─────────────────────────────────────┤
│ Full Message: ${message} │
│ Request Data: ${requestData.substring(0, 20)} │
└─────────────────────────────────────┘
    `);

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
