import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../types/error.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  if (process.env.NODE_ENV !== 'test') console.error('[ERROR]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};
