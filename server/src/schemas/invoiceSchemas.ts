import { z } from 'zod';

const lineItemInputSchema = z.object({
  itemId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  itemName: z.string().min(1),
  variantLabel: z.string().optional().default(''),
  quantity: z.number().int().positive(),
  basePrice: z.number().int().nonnegative(),
  gstRate: z.union([z.literal(0), z.literal(5), z.literal(12), z.literal(18)]),
  discountType: z.enum(['percentage', 'absolute']),
  discountValue: z.number().nonnegative(),
});

export const invoiceCreateSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(5),
    email: z.string().email(),
    address: z.string().min(1),
  }),
  lineItems: z.array(lineItemInputSchema).min(1),
});

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;
