import { Invoice } from '../models/Invoice.js';
import { HttpError } from '../types/error.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { calculateInvoice, LineItemInput } from '../services/invoiceCalc.js';
import { nextInvoiceNumber } from '../services/invoiceNumber.js';

export const listInvoices = asyncHandler(async (_req, res) => {
  const invoices = await Invoice.find()
    .sort({ createdAt: -1 })
    .select('invoiceNumber customer.name grandTotal createdAt');
  res.json({ success: true, data: invoices });
});

export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new HttpError(404, 'Invoice not found');
  res.json({ success: true, data: invoice });
});

export const createInvoice = asyncHandler(async (req, res) => {
  const { customer, lineItems } = req.body as {
    customer: unknown;
    lineItems: LineItemInput[];
  };
  const totals = calculateInvoice(lineItems);
  const invoiceNumber = await nextInvoiceNumber();
  const merged = lineItems.map((li, i) => ({ ...li, ...totals.lineItems[i] }));
  const invoice = await Invoice.create({
    invoiceNumber,
    customer,
    lineItems: merged,
    subtotal: totals.subtotal,
    totalDiscount: totals.totalDiscount,
    totalGst: totals.totalGst,
    grandTotal: totals.grandTotal,
  });
  res.status(201).json({ success: true, data: invoice });
});
