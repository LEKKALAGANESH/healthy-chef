import { api } from './axios';
import type { Item, ItemInput } from '../types/item';
import type { ApiSuccess } from '../types/api';

export const fetchItems = () =>
  api.get<ApiSuccess<Item[]>>('/items').then((r) => r.data.data);

export const createItem = (input: ItemInput) =>
  api.post<ApiSuccess<Item>>('/items', input).then((r) => r.data.data);

export const updateItem = (id: string, input: Partial<ItemInput>) =>
  api.patch<ApiSuccess<Item>>(`/items/${id}`, input).then((r) => r.data.data);

export const deleteItem = (id: string) =>
  api.delete(`/items/${id}`).then(() => id);
