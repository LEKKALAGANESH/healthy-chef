import { calculateLineItem, calculateInvoice } from './invoiceMath';

describe('invoiceMath (client mirror of server calc)', () => {
  it('salad: percentage discount', () => {
    const r = calculateLineItem({
      quantity: 2,
      basePrice: 25000,
      gstRate: 5,
      discountType: 'percentage',
      discountValue: 10,
    });
    expect(r.rowTotal).toBe(47250);
  });

  it('juice: absolute discount', () => {
    const r = calculateLineItem({
      quantity: 3,
      basePrice: 12000,
      gstRate: 12,
      discountType: 'absolute',
      discountValue: 2000,
    });
    expect(r.rowTotal).toBe(38080);
  });

  it('sums invoice', () => {
    const inv = calculateInvoice([
      { quantity: 2, basePrice: 25000, gstRate: 5, discountType: 'percentage', discountValue: 10 },
      { quantity: 1, basePrice: 15000, gstRate: 5, discountType: 'absolute', discountValue: 0 },
      { quantity: 3, basePrice: 12000, gstRate: 12, discountType: 'absolute', discountValue: 2000 },
    ]);
    expect(inv.subtotal).toBe(101000);
    expect(inv.grandTotal).toBe(101080);
  });
});
