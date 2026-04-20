import { Item } from '../models/Item.js';
import { HttpError } from '../types/error.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listItems = asyncHandler(async (_req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

export const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) throw new HttpError(404, 'Item not found');
  res.json({ success: true, data: item });
});

export const createItem = asyncHandler(async (req, res) => {
  const item = await Item.create(req.body);
  res.status(201).json({ success: true, data: item });
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new HttpError(404, 'Item not found');
  res.json({ success: true, data: item });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) throw new HttpError(404, 'Item not found');
  res.json({ success: true, data: { id: req.params.id } });
});
