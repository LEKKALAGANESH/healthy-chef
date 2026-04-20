import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { itemCreateSchema, itemUpdateSchema } from '../schemas/itemSchemas.js';
import {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';

const router = Router();
router.get('/', listItems);
router.get('/:id', getItem);
router.post('/', validate(itemCreateSchema), createItem);
router.patch('/:id', validate(itemUpdateSchema), updateItem);
router.delete('/:id', deleteItem);
export default router;
