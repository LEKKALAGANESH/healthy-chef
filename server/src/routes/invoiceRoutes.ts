import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { invoiceCreateSchema } from '../schemas/invoiceSchemas.js';
import {
  listInvoices,
  getInvoice,
  createInvoice,
} from '../controllers/invoiceController.js';

const router = Router();
router.get('/', listInvoices);
router.get('/:id', getInvoice);
router.post('/', validate(invoiceCreateSchema), createInvoice);
export default router;
