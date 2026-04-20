import request from 'supertest';
import { createApp } from '../../app.js';

const app = createApp();

const samplePayload = {
  customer: { name: 'Rohan', phone: '9876543210', email: 'r@x.com', address: 'Bengaluru' },
  lineItems: [
    {
      itemId: '000000000000000000000001',
      itemName: 'Salad',
      quantity: 2,
      basePrice: 25000,
      gstRate: 5,
      discountType: 'percentage',
      discountValue: 10,
    },
  ],
};

describe('Invoice routes', () => {
  it('POST /api/invoices calculates totals, assigns number, saves', async () => {
    const res = await request(app).post('/api/invoices').send(samplePayload);
    expect(res.status).toBe(201);
    expect(res.body.data.invoiceNumber).toMatch(/^INV-\d{4}-\d{4}$/);
    expect(res.body.data.grandTotal).toBe(47250);
    expect(res.body.data.lineItems[0].rowTotal).toBe(47250);
  });

  it('POST rejects empty lineItems', async () => {
    const res = await request(app)
      .post('/api/invoices')
      .send({ ...samplePayload, lineItems: [] });
    expect(res.status).toBe(400);
  });

  it('GET /api/invoices returns summary list', async () => {
    await request(app).post('/api/invoices').send(samplePayload);
    const res = await request(app).get('/api/invoices');
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('invoiceNumber');
    expect(res.body.data[0]).toHaveProperty('grandTotal');
  });

  it('GET /api/invoices/:id returns full invoice', async () => {
    const created = await request(app).post('/api/invoices').send(samplePayload);
    const id = created.body.data._id;
    const res = await request(app).get(`/api/invoices/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.lineItems).toHaveLength(1);
  });
});
