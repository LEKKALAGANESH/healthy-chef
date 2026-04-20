import mongoose from 'mongoose';
import { Invoice } from '../../models/Invoice.js';

const validLineItem = {
  itemId: new mongoose.Types.ObjectId(),
  itemName: 'Salad',
  variantLabel: 'Size:Large',
  quantity: 2,
  basePrice: 25000,
  gstRate: 5,
  discountType: 'percentage' as const,
  discountValue: 10,
  rowGross: 50000,
  rowDiscount: 5000,
  rowGst: 2250,
  rowTotal: 47250,
};

const baseInvoice = {
  invoiceNumber: 'INV-2026-0001',
  customer: {
    name: 'Rohan',
    phone: '+919876543210',
    email: 'r@x.com',
    address: '4th Floor, Tech Park',
  },
  lineItems: [validLineItem],
  subtotal: 50000,
  totalDiscount: 5000,
  totalGst: 2250,
  grandTotal: 47250,
};

describe('Invoice model', () => {
  it('requires invoiceNumber, customer, lineItems, totals', async () => {
    const bad = new Invoice({});
    await expect(bad.validate()).rejects.toThrow();
  });

  it('rejects duplicate invoiceNumber', async () => {
    await Invoice.create(baseInvoice);
    await expect(Invoice.create(baseInvoice)).rejects.toThrow(/duplicate/i);
  });

  it('enforces gstRate enum', async () => {
    const bad = new Invoice({
      ...baseInvoice,
      lineItems: [{ ...validLineItem, gstRate: 7 }],
    });
    await expect(bad.validate()).rejects.toThrow();
  });

  it('enforces discountType enum', async () => {
    const bad = new Invoice({
      ...baseInvoice,
      lineItems: [{ ...validLineItem, discountType: 'weird' }],
    });
    await expect(bad.validate()).rejects.toThrow();
  });

  it('persists and returns the invoice with timestamps', async () => {
    const saved = await Invoice.create(baseInvoice);
    expect(saved.grandTotal).toBe(47250);
    expect(saved.createdAt).toBeInstanceOf(Date);
  });
});
