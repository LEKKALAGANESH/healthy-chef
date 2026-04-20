const isTest = import.meta.env.MODE === 'test';

export const CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
} as const;

if (!isTest && !CONFIG.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is missing from env — copy .env.example to .env');
}
