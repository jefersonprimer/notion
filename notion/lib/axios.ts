import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/api';

const SESSION_KEY = 'my-session';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const storedSession = await AsyncStorage.getItem(SESSION_KEY);
    if (storedSession) {
      const session = JSON.parse(storedSession);
      if (session.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
  } catch (e) {
    console.error("Failed to get session from storage for axios interceptor", e);
  }
  return config;
});

export default api;
