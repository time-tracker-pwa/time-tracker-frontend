import axios from 'axios';

// Создаем экземпляр axios с базовым URL и конфигурацией
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок и добавления токенов авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки офлайн-режима
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine) {
      // Если нет сети, можно показать уведомление пользователю
      console.log(
        'You are currently offline. Data will be synced when you are back online.'
      );
    }
    return Promise.reject(error);
  }
);
