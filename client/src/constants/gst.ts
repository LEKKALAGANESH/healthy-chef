import type { GstRate, DiscountType } from '../types/invoice';

export const GST_RATES: GstRate[] = [0, 5, 12, 18];
export const DISCOUNT_TYPES: DiscountType[] = ['percentage', 'absolute'];

export const TERMS_AND_CONDITIONS: string[] = [
  'Payment is due within 15 days of the invoice date.',
  'A late fee of 2% per month will be applied to overdue balances.',
  'All disputes are subject to Bengaluru jurisdiction only.',
];
