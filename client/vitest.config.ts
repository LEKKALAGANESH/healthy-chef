import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    env: {
      VITE_API_BASE_URL: 'http://localhost:5000/api',
      VITE_APP_NAME: 'HealthyChef',
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://localhost:5000/api'),
    'import.meta.env.VITE_APP_NAME': JSON.stringify('HealthyChef'),
  },
});
