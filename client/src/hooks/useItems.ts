import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/items';
import type { ItemInput } from '../types/item';

const KEY = ['items'] as const;

export const useItems = () => useQuery({ queryKey: KEY, queryFn: api.fetchItems });

export const useCreateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
};

export const useUpdateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ItemInput> }) =>
      api.updateItem(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
};

export const useDeleteItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
};
