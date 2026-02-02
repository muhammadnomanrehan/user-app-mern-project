import mongoose from "mongoose";

export const CATEGORY_ENUM = [
  "Food",
  "Beverage",
  "Grocery",
  "Electronics",
  "Clothing",
  "Bakery",
  "Cosmetics",
  "Other",
];

const InventoryItemSchema = new mongoose.Schema(
  {
    itemCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORY_ENUM, trim: true },

    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },

    stockQty: { type: Number, required: true, min: 0, default: 0 },

    imageUrl: { type: String, default: "", trim: true, required: true },
    description: { type: String, default: "", trim: true },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
  },
  { timestamps: true }
);

InventoryItemSchema.index({ itemCode: 1 }, { unique: true });
InventoryItemSchema.set("toJSON", { virtuals: true, versionKey: false });

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);
export default InventoryItem;
