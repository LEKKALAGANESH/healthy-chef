import { z } from 'zod';

export const itemCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(''),
  variants: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .default([]),
  basePrice: z.number().int().nonnegative(),
});

export const itemUpdateSchema = itemCreateSchema.partial();

export type ItemCreateInput = z.infer<typeof itemCreateSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>;
