import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/invoices';

const KEY = ['invoices'] as const;

export const useInvoices = () => useQuery({ queryKey: KEY, queryFn: api.fetchInvoices });

export const useInvoice = (id: string) =>
  useQuery({
    queryKey: [...KEY, id],
    queryFn: () => api.fetchInvoice(id),
    enabled: !!id,
  });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createInvoice,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
};
