import { paiseToRupees, rupeesToPaise, formatINR, formatINRPlain } from './money';

describe('money', () => {
  it('converts paise → rupees', () => {
    expect(paiseToRupees(12345)).toBe(123.45);
  });
  it('converts rupees → paise (rounded)', () => {
    expect(rupeesToPaise(123.457)).toBe(12346);
  });
  it('formats with ₹ symbol and 2 decimals', () => {
    // Intl output may contain NBSP between currency and number; normalize whitespace.
    expect(formatINR(12345).replace(/\s/g, '')).toBe('₹123.45');
  });
  it('uses Indian number grouping for large amounts (lakh)', () => {
    expect(formatINRPlain(1234567)).toBe('12,345.67');
    expect(formatINRPlain(12345678)).toBe('1,23,456.78');
  });
  it('handles zero', () => {
    expect(formatINR(0).replace(/\s/g, '')).toBe('₹0.00');
  });
});
