export type GstRate = 0 | 5 | 12 | 18;
export type DiscountType = 'percentage' | 'absolute';

export interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface DraftLineItem {
  id: string; // client-side uuid for React key
  itemId: string;
  itemName: string;
  variantLabel?: string;
  quantity: number;
  basePrice: number; // paise
  gstRate: GstRate;
  discountType: DiscountType;
  discountValue: number; // percent or paise
}

export interface InvoiceLineItem {
  itemId: string;
  itemName: string;
  variantLabel?: string;
  quantity: number;
  basePrice: number;
  gstRate: GstRate;
  discountType: DiscountType;
  discountValue: number;
  rowGross: number;
  rowDiscount: number;
  rowGst: number;
  rowTotal: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: Customer;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  totalDiscount: number;
  totalGst: number;
  grandTotal: number;
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceSummary {
  _id: string;
  invoiceNumber: string;
  customer: { name: string };
  grandTotal: number;
  createdAt: string;
}
