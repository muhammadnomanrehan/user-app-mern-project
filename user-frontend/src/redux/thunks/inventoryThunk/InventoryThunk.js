// src/thunk/inventoryThunk/InventoryThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api"; // ⬅️ adjust if your api.js path differs (e.g., '../../api.js')

/** Helper: common auth headers from auth slice */
const authHeaders = (getState) => {
  const token = getState()?.auth?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** GET /inventory/items */
export const fetchItems = createAsyncThunk(
  "inventory/fetchItems",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await api.get("/inventory/items", {
        headers: { ...authHeaders(getState) },
      });
      // expecting { success, data: [...] }
      return res.data?.data || [];
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to fetch items";
      return rejectWithValue(msg);
    }
  }
);

/** GET /inventory/items/:id */
export const fetchItemById = createAsyncThunk(
  "inventory/fetchItemById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const res = await api.get(`/inventory/items/${id}`, {
        headers: { ...authHeaders(getState) },
      });
      return res.data?.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to fetch item";
      return rejectWithValue(msg);
    }
  }
);

/** GET /inventory/items/check-code?itemCode=XXX */
export const checkItemCode = createAsyncThunk(
  "inventory/checkItemCode",
  async (itemCode, { getState, rejectWithValue }) => {
    try {
      const res = await api.get(`/inventory/items/check-code`, {
        headers: { ...authHeaders(getState) },
        params: { itemCode },
      });
      // expecting { success, exists: boolean }
      return { itemCode, exists: !!res.data?.exists };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to check code";
      return rejectWithValue(msg);
    }
  }
);

/** POST /inventory/items  (FormData; file key must be "image") */
export const addItem = createAsyncThunk(
  "inventory/addItem",
  async (formData, { getState, rejectWithValue }) => {
    try {
      // DO NOT set 'Content-Type' for multipart; Axios sets it automatically
      const res = await api.post("/inventory/items", formData, {
        headers: { ...authHeaders(getState) },
      });
      return res.data?.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to add item";
      return rejectWithValue(msg);
    }
  }
);

/** PUT /inventory/items/:id (FormData; optional "image") */
export const updateItem = createAsyncThunk(
  "inventory/updateItem",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const res = await api.put(`/inventory/items/${id}`, formData, {
        headers: { ...authHeaders(getState) },
      });
      return res.data?.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to update item";
      return rejectWithValue(msg);
    }
  }
);

/** DELETE /inventory/items/:id */
export const deleteItem = createAsyncThunk(
  "inventory/deleteItem",
  async (id, { getState, rejectWithValue }) => {
    try {
      await api.delete(`/inventory/items/${id}`, {
        headers: { ...authHeaders(getState) },
      });
      return { id };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to delete item";
      return rejectWithValue(msg);
    }
  }
);