const PAISE_PER_RUPEE = 100;

export const paiseToRupees = (p: number): number => p / PAISE_PER_RUPEE;
export const rupeesToPaise = (r: number): number => Math.round(r * PAISE_PER_RUPEE);

const inrCurrency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrPlain = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formatted with ₹ prefix and Indian lakh grouping. */
export const formatINR = (paise: number): string => inrCurrency.format(paiseToRupees(paise));

/** Number only, Indian grouping, no currency symbol. For PDF cells where ₹ lives in the header. */
export const formatINRPlain = (paise: number): string => inrPlain.format(paiseToRupees(paise));
