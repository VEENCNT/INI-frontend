import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Маршрут к веб-сервису (обход CORS без настройки бэкенда)
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Второй маршрут — к silo (MinIO) для изображений/видео
      '/s3': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ''),
      },
    },
  },
})
