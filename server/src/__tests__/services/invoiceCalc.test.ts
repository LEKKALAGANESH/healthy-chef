import { calculateLineItem, calculateInvoice, GstRate } from '../../services/invoiceCalc.js';

describe('calculateLineItem', () => {
  it('handles percentage discount (salad sample)', () => {
    const r = calculateLineItem({
      quantity: 2,
      basePrice: 25000,
      gstRate: 5,
      discountType: 'percentage',
      discountValue: 10,
    });
    expect(r.rowGross).toBe(50000);
    expect(r.rowDiscount).toBe(5000);
    expect(r.rowGst).toBe(2250);
    expect(r.rowTotal).toBe(47250);
  });

  it('handles absolute discount (juice sample)', () => {
    const r = calculateLineItem({
      quantity: 3,
      basePrice: 12000,
      gstRate: 12,
      discountType: 'absolute',
      discountValue: 2000,
    });
    expect(r.rowGross).toBe(36000);
    expect(r.rowDiscount).toBe(2000);
    expect(r.rowGst).toBe(4080);
    expect(r.rowTotal).toBe(38080);
  });

  it('handles zero discount', () => {
    const r = calculateLineItem({
      quantity: 1,
      basePrice: 15000,
      gstRate: 5,
      discountType: 'absolute',
      discountValue: 0,
    });
    expect(r.rowTotal).toBe(15750);
  });

  it('caps absolute discount at gross (cannot go negative)', () => {
    const r = calculateLineItem({
      quantity: 1,
      basePrice: 10000,
      gstRate: 5,
      discountType: 'absolute',
      discountValue: 99999,
    });
    expect(r.rowDiscount).toBe(10000);
    expect(r.rowGst).toBe(0);
    expect(r.rowTotal).toBe(0);
  });

  it('caps percentage discount at 100%', () => {
    const r = calculateLineItem({
      quantity: 2,
      basePrice: 5000,
      gstRate: 18,
      discountType: 'percentage',
      discountValue: 150,
    });
    expect(r.rowDiscount).toBe(10000);
    expect(r.rowTotal).toBe(0);
  });

  it('throws on invalid GST rate', () => {
    expect(() =>
      calculateLineItem({
        quantity: 1,
        basePrice: 100,
        gstRate: 7 as GstRate,
        discountType: 'absolute',
        discountValue: 0,
      })
    ).toThrow(/gst/i);
  });

  it('rounds GST to nearest paise', () => {
    const r = calculateLineItem({
      quantity: 1,
      basePrice: 333,
      gstRate: 18,
      discountType: 'absolute',
      discountValue: 0,
    });
    expect(r.rowGst).toBe(60);
  });
});

describe('calculateInvoice', () => {
  it('sums correctly across all 3 sample lines', () => {
    const inv = calculateInvoice([
      { quantity: 2, basePrice: 25000, gstRate: 5, discountType: 'percentage', discountValue: 10 },
      { quantity: 1, basePrice: 15000, gstRate: 5, discountType: 'absolute', discountValue: 0 },
      { quantity: 3, basePrice: 12000, gstRate: 12, discountType: 'absolute', discountValue: 2000 },
    ]);
    expect(inv.subtotal).toBe(101000);
    expect(inv.totalDiscount).toBe(7000);
    expect(inv.totalGst).toBe(7080);
    expect(inv.grandTotal).toBe(101080);
    expect(inv.lineItems).toHaveLength(3);
  });
});
