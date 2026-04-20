import { Invoice } from '../../models/Invoice.js';
import { nextInvoiceNumber } from '../../services/invoiceNumber.js';
import mongoose from 'mongoose';

const seed = (invoiceNumber: string, createdAt: Date) =>
  Invoice.create({
    invoiceNumber,
    customer: { name: 'x', phone: '1', email: 'a@b.c', address: 'y' },
    lineItems: [
      {
        itemId: new mongoose.Types.ObjectId(),
        itemName: 'i',
        quantity: 1,
        basePrice: 100,
        gstRate: 5,
        discountType: 'absolute',
        discountValue: 0,
        rowGross: 100,
        rowDiscount: 0,
        rowGst: 5,
        rowTotal: 105,
      },
    ],
    subtotal: 100,
    totalDiscount: 0,
    totalGst: 5,
    grandTotal: 105,
    createdAt,
  });

describe('nextInvoiceNumber', () => {
  it('returns INV-{year}-0001 when no invoices exist for the year', async () => {
    expect(await nextInvoiceNumber(new Date('2026-05-15'))).toBe('INV-2026-0001');
  });

  it('increments within the current year', async () => {
    await seed('INV-2026-0001', new Date('2026-01-02'));
    await seed('INV-2026-0002', new Date('2026-02-02'));
    expect(await nextInvoiceNumber(new Date('2026-03-01'))).toBe('INV-2026-0003');
  });

  it('resets for a new year', async () => {
    await seed('INV-2025-0099', new Date('2025-12-31'));
    expect(await nextInvoiceNumber(new Date('2026-01-01'))).toBe('INV-2026-0001');
  });
});
