import axios from 'axios';
import { CONFIG } from '../constants/config';

export const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  timeout: 10_000,
});
