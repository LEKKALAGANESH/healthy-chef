import { api } from './axios';
import type { ApiSuccess } from '../types/api';
import type { Invoice, InvoiceSummary, DraftLineItem, Customer } from '../types/invoice';

export interface CreateInvoicePayload {
  customer: Customer;
  lineItems: Array<Omit<DraftLineItem, 'id'>>;
}

export const fetchInvoices = () =>
  api.get<ApiSuccess<InvoiceSummary[]>>('/invoices').then((r) => r.data.data);

export const fetchInvoice = (id: string) =>
  api.get<ApiSuccess<Invoice>>(`/invoices/${id}`).then((r) => r.data.data);

export const createInvoice = (payload: CreateInvoicePayload) =>
  api.post<ApiSuccess<Invoice>>('/invoices', payload).then((r) => r.data.data);
