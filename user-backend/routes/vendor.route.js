import express from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deactivateVendor,
} from "../controllers/vendor.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= VENDOR ROUTES ================= */

// 🔐 ALL vendor routes are protected
router.use(requireAuth);

// Create vendor
router.post("/", createVendor);

// Get all vendors
router.get("/", getVendors);

// Get single vendor
router.get("/:id", getVendorById);

// Update vendor
router.put("/:id", updateVendor);

// Soft delete (inactive)
router.patch("/:id/deactivate", deactivateVendor);

export default router;
