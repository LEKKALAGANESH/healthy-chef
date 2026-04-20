export type GstRate = 0 | 5 | 12 | 18;
export type DiscountType = 'percentage' | 'absolute';

export interface LineItemInput {
  quantity: number;
  basePrice: number; // paise
  gstRate: GstRate;
  discountType: DiscountType;
  discountValue: number; // percent (0-100) or paise
}

export interface LineItemResult extends LineItemInput {
  rowGross: number;
  rowDiscount: number;
  rowGst: number;
  rowTotal: number;
}

const GST_RATES: ReadonlySet<GstRate> = new Set([0, 5, 12, 18]);
const HUNDRED = 100;

const round = (n: number): number => Math.round(n);

export function calculateLineItem(input: LineItemInput): LineItemResult {
  if (!GST_RATES.has(input.gstRate)) {
    throw new Error(`invalid GST rate: ${input.gstRate}`);
  }
  const rowGross = round(input.quantity * input.basePrice);
  const rawDiscount =
    input.discountType === 'percentage'
      ? (rowGross * Math.min(input.discountValue, HUNDRED)) / HUNDRED
      : input.discountValue;
  const rowDiscount = round(Math.min(rawDiscount, rowGross));
  const rowTaxable = rowGross - rowDiscount;
  const rowGst = round((rowTaxable * input.gstRate) / HUNDRED);
  const rowTotal = rowTaxable + rowGst;
  return { ...input, rowGross, rowDiscount, rowGst, rowTotal };
}

export interface InvoiceTotals {
  lineItems: LineItemResult[];
  subtotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
}

export function calculateInvoice(lines: LineItemInput[]): InvoiceTotals {
  const lineItems = lines.map(calculateLineItem);
  const subtotal = lineItems.reduce((s, l) => s + l.rowGross, 0);
  const totalDiscount = lineItems.reduce((s, l) => s + l.rowDiscount, 0);
  const totalGst = lineItems.reduce((s, l) => s + l.rowGst, 0);
  const grandTotal = lineItems.reduce((s, l) => s + l.rowTotal, 0);
  return { lineItems, subtotal, totalDiscount, totalGst, grandTotal };
}
