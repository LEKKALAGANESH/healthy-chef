import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import itemRoutes from './routes/itemRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: '10kb' }));
  app.use(mongoSanitize());
  app.use('/api', rateLimit({ windowMs: 15 * 60_000, max: 1000 }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/items', itemRoutes);
  app.use('/api/invoices', invoiceRoutes);

  app.use(errorHandler);

  return app;
}
