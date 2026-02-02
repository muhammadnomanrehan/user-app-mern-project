import Vendor from "../models/vendor.model.js";

/* ================= CREATE VENDOR ================= */
export const createVendor = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Vendor name is required" });
    }

    const vendor = await Vendor.create({
      name,
      phone,
      email,
      address,
      createdBy: req.user.id, // ✅ FIXED
    });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL VENDORS ================= */
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: "active" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName email");

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE VENDOR ================= */
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate("createdBy", "firstName lastName email");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE VENDOR ================= */
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= SOFT DELETE (INACTIVE) ================= */
export const deactivateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({
      message: "Vendor deactivated successfully",
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
