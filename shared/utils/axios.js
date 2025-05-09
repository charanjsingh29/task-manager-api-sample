import axios from 'axios';
import constants from './constants';
import useAuthStore from '../store/authStore';
import { notifications } from '@mantine/notifications';

const axiosInstance = axios.create({
  baseURL: constants.API_BASE_URL,
  withCredentials: true,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().removeUserData();
      // window.location.href = '/login';
    }
    if (error.response && error.response.status === 403) {

      let message = "Server Error";
      if (error.response.data.message) {
        message = error.response.data.message;
      }
      notifications.show({
        title: "Error",
        message: message,
        color: "red",
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;