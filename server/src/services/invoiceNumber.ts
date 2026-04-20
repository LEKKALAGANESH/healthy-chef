import { Invoice } from '../models/Invoice.js';

const PAD_LENGTH = 4;
const PREFIX = 'INV';

export async function nextInvoiceNumber(now: Date = new Date()): Promise<string> {
  const year = now.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const count = await Invoice.countDocuments({ createdAt: { $gte: start, $lt: end } });
  const next = (count + 1).toString().padStart(PAD_LENGTH, '0');
  return `${PREFIX}-${year}-${next}`;
}
