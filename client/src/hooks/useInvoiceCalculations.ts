import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { calculateInvoice } from '../utils/invoiceMath';
import type { RootState } from '../app/rootReducer';

export function useInvoiceCalculations() {
  const lineItems = useSelector((s: RootState) => s.invoiceDraft.lineItems);
  return useMemo(
    () =>
      calculateInvoice(
        lineItems.map((l) => ({
          quantity: l.quantity,
          basePrice: l.basePrice,
          gstRate: l.gstRate,
          discountType: l.discountType,
          discountValue: l.discountValue,
        }))
      ),
    [lineItems]
  );
}
