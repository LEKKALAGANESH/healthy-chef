import { Schema, model, InferSchemaType } from 'mongoose';

const variantSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    name: { type: String, required: [true, 'Item name required'], trim: true },
    description: { type: String, trim: true, default: '' },
    variants: { type: [variantSchema], default: [] },
    basePrice: {
      type: Number,
      required: [true, 'basePrice required'],
      min: [0, 'basePrice must be positive'],
    },
  },
  { timestamps: true }
);

itemSchema.index({ name: 1 });
itemSchema.index({ createdAt: -1 });

itemSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.__v;
    return ret;
  },
});

export type ItemDoc = InferSchemaType<typeof itemSchema>;
export const Item = model('Item', itemSchema);
