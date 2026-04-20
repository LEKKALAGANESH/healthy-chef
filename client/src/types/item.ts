export interface Variant {
  label: string;
  value: string;
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  variants: Variant[];
  basePrice: number; // paise
  createdAt: string;
  updatedAt: string;
}

export interface ItemInput {
  name: string;
  description?: string;
  variants?: Variant[];
  basePrice: number;
}
