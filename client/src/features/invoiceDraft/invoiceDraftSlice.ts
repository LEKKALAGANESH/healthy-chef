import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { Customer, DraftLineItem } from '../../types/invoice';

interface State {
  customer: Customer;
  lineItems: DraftLineItem[];
}

const emptyCustomer: Customer = { name: '', phone: '', email: '', address: '' };
const initialState: State = { customer: emptyCustomer, lineItems: [] };

const slice = createSlice({
  name: 'invoiceDraft',
  initialState,
  reducers: {
    setCustomer: (s, a: PayloadAction<Partial<Customer>>) => {
      s.customer = { ...s.customer, ...a.payload };
    },
    addLine: (s, a: PayloadAction<Omit<DraftLineItem, 'id'>>) => {
      s.lineItems.push({ ...a.payload, id: nanoid() });
    },
    updateLine: (s, a: PayloadAction<{ id: string; patch: Partial<DraftLineItem> }>) => {
      const line = s.lineItems.find((l) => l.id === a.payload.id);
      if (line) Object.assign(line, a.payload.patch);
    },
    removeLine: (s, a: PayloadAction<string>) => {
      s.lineItems = s.lineItems.filter((l) => l.id !== a.payload);
    },
    resetDraft: () => initialState,
  },
});

export const { setCustomer, addLine, updateLine, removeLine, resetDraft } = slice.actions;
export default slice.reducer;
