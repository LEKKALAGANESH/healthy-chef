import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const app = createApp();

connectDB()
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(env.PORT, () => console.log(`🚀 http://localhost:${env.PORT}`));
  })
  .catch((err) => {
    console.error('❌ Mongo connection failed:', err);
    process.exit(1);
  });
