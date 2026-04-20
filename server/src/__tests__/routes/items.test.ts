import request from 'supertest';
import { createApp } from '../../app.js';
import { Item } from '../../models/Item.js';

const app = createApp();

describe('Item routes', () => {
  it('POST /api/items creates an item', async () => {
    const res = await request(app).post('/api/items').send({ name: 'Salad', basePrice: 25000 });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Salad');
  });

  it('POST /api/items validates', async () => {
    const res = await request(app).post('/api/items').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('GET /api/items lists items sorted by createdAt desc', async () => {
    await Item.create({ name: 'Older', basePrice: 100, createdAt: new Date('2026-01-01') });
    await Item.create({ name: 'Newer', basePrice: 200, createdAt: new Date('2026-02-01') });
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body.data[0].name).toBe('Newer');
  });

  it('PATCH /api/items/:id updates', async () => {
    const item = await Item.create({ name: 'X', basePrice: 100 });
    const res = await request(app).patch(`/api/items/${item._id}`).send({ name: 'Y' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Y');
  });

  it('DELETE /api/items/:id removes', async () => {
    const item = await Item.create({ name: 'X', basePrice: 100 });
    const res = await request(app).delete(`/api/items/${item._id}`);
    expect(res.status).toBe(200);
    expect(await Item.findById(item._id)).toBeNull();
  });

  it('returns 404 for missing id', async () => {
    const res = await request(app).get('/api/items/000000000000000000000099');
    expect(res.status).toBe(404);
  });
});
