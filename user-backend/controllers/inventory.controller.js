
import InventoryItem, { CATEGORY_ENUM } from '../models/inventory.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { uploadBufferToSupabase } from '../utils/supabase.js';

const BUCKET = process.env.SUPABASE_BUCKET;

// Create
export const createItem = asyncHandler(async (req, res) => {
  const { itemCode, name, category, costPrice, sellingPrice, stockQty, description } = req.body;

  if (!itemCode || !itemCode.trim()) throw new HttpError(400, 'itemCode is required');
  if (!name || !name.trim()) throw new HttpError(400, 'name is required');
  if (!CATEGORY_ENUM.includes(category)) {
    throw new HttpError(400, `category must be one of: ${CATEGORY_ENUM.join(', ')}`);
  }

  let imageUrl = '';
  if (req.file) {
    try {
      const { publicUrl } = await uploadBufferToSupabase({
        bucket: BUCKET,
        folder: 'items',
        filename: req.file.originalname,
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
      });
      imageUrl = publicUrl;
    } catch {
      throw new HttpError(500, 'Image upload failed');
    }
  }

  try {
    const item = await InventoryItem.create({
      itemCode: itemCode.trim(),
      name: name.trim(),
      category,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQty: Number(stockQty),
      imageUrl,
      description: description ? String(description).trim() : '',
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.itemCode) {
      throw new HttpError(409, 'Item code already exists');
    }
    throw err;
  }
});

// List
export const getItems = asyncHandler(async (_req, res) => {
  const items = await InventoryItem.find().sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

// Read one
export const getItemById = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findById(req.params.id);
  if (!item) throw new HttpError(404, 'Item not found');
  res.json({ success: true, data: item });
});

// Update (optional image replace)
export const updateItem = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const update = {};

  if (body.itemCode !== undefined) {
    const v = String(body.itemCode).trim();
    if (!v) throw new HttpError(400, 'itemCode cannot be empty');
    update.itemCode = v;
  }
  if (body.name !== undefined) {
    const v = String(body.name).trim();
    if (!v) throw new HttpError(400, 'name cannot be empty');
    update.name = v;
  }
  if (body.category !== undefined) {
    if (!CATEGORY_ENUM.includes(body.category)) {
      throw new HttpError(400, `category must be one of: ${CATEGORY_ENUM.join(', ')}`);
    }
    update.category = body.category;
  }
  if (body.costPrice !== undefined) {
    const v = Number(body.costPrice);
    if (Number.isNaN(v) || v < 0) throw new HttpError(400, 'costPrice must be a non-negative number');
    update.costPrice = v;
  }
  if (body.sellingPrice !== undefined) {
    const v = Number(body.sellingPrice);
    if (Number.isNaN(v) || v < 0) throw new HttpError(400, 'sellingPrice must be a non-negative number');
    update.sellingPrice = v;
  }
  if (body.stockQty !== undefined) {
    const v = Number(body.stockQty);
    if (Number.isNaN(v) || v < 0) throw new HttpError(400, 'stockQty must be a non-negative number');
    update.stockQty = v;
  }
  if (body.description !== undefined) {
    update.description = String(body.description).trim();
  }

  if (req.file) {
    try {
      const { publicUrl } = await uploadBufferToSupabase({
        bucket: BUCKET,
        folder: 'items',
        filename: req.file.originalname,
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
      });
      update.imageUrl = publicUrl;
    } catch {
      throw new HttpError(500, 'Image upload failed');
    }
  }

  try {
    const updated = await InventoryItem.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new HttpError(404, 'Item not found');
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.itemCode) {
      throw new HttpError(409, 'Item code already exists');
    }
    throw err;
  }
});

// Delete (optional)
export const deleteItem = asyncHandler(async (req, res) => {
  const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, 'Item not found');
  res.json({ success: true, message: 'Item deleted', data: deleted });
});

// Duplicate code check
export const checkItemCode = asyncHandler(async (req, res) => {
  const code = String(req.query.itemCode || '').trim();
  if (!code) throw new HttpError(400, 'itemCode query param required');
  const exists = await InventoryItem.exists({ itemCode: code });
  res.json({ success: true, exists: !!exists });
});