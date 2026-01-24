import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Next.js API routes
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const sessionStr = localStorage.getItem('notion-web-session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (e) {
        console.error('Failed to parse session from localStorage', e);
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('notion-web-session');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
