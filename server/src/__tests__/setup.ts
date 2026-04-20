import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';
// Provide a placeholder so env.ts passes Zod validation at module-load;
// beforeAll overrides with the actual in-memory-server URI for real connections.
process.env.MONGO_URI = 'mongodb://placeholder/test';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  await mongoose.connect(process.env.MONGO_URI);
  // Build indexes (needed for unique constraints to fire in tests)
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
});

afterEach(async () => {
  for (const col of Object.values(mongoose.connection.collections)) {
    await col.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
