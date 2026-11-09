import axios from 'axios';

/**
 * Базовый axios-инстанс для обращений к веб-сервису.
 * Запросы идут через Vite-прокси /api -> http://localhost:8080/api
 * (обход CORS без настройки заголовков на бэкенде).
 */
export const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Подстановка JWT из localStorage в каждый запрос к защищенным методам
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
