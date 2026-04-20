import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(mongoSanitize());
  app.use('/api', rateLimit({ windowMs: 15 * 60_000, max: 100 }));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  return app;
}
