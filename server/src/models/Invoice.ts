import { Schema, model, InferSchemaType } from 'mongoose';

export const GST_RATES = [0, 5, 12, 18] as const;
export const DISCOUNT_TYPES = ['percentage', 'absolute'] as const;

const lineItemSchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    itemName: { type: String, required: true, trim: true },
    variantLabel: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    basePrice: { type: Number, required: true, min: 0 },
    gstRate: { type: Number, required: true, enum: GST_RATES },
    discountType: { type: String, required: true, enum: DISCOUNT_TYPES },
    discountValue: { type: Number, required: true, min: 0 },
    rowGross: { type: Number, required: true, min: 0 },
    rowDiscount: { type: Number, required: true, min: 0 },
    rowGst: { type: Number, required: true, min: 0 },
    rowTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: customerSchema, required: true },
    lineItems: {
      type: [lineItemSchema],
      required: true,
      validate: [(v: unknown[]) => Array.isArray(v) && v.length > 0, 'at least one line item required'],
    },
    subtotal: { type: Number, required: true, min: 0 },
    totalDiscount: { type: Number, required: true, min: 0 },
    totalGst: { type: Number, required: true, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ 'customer.email': 1 });

invoiceSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.__v;
    return ret;
  },
});

export type InvoiceDoc = InferSchemaType<typeof invoiceSchema>;
export const Invoice = model('Invoice', invoiceSchema);
