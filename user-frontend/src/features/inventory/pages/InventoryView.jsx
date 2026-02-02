import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemById } from "../../../redux/thunks/inventoryThunk/InventoryThunk";
import {
  selectCurrentItem,
  selectItemLoading,
} from "../../../redux/slices/inventorySlices/InventorySlice";

const InventoryView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const item = useSelector(selectCurrentItem);
  const loading = useSelector(selectItemLoading);

  useEffect(() => {
    dispatch(fetchItemById(id));
  }, [id, dispatch]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!item) return <p className="p-6">No data</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Inventory Details</h1>
        <Link to="/inventory" className="text-blue-600">
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="rounded-lg border"
        />

        <div className="space-y-2 text-sm">
          <p><b>Item Code:</b> {item.itemCode}</p>
          <p><b>Name:</b> {item.name}</p>
          <p><b>Category:</b> {item.category}</p>
          <p><b>Cost Price:</b> {item.costPrice}</p>
          <p><b>Selling Price:</b> {item.sellingPrice}</p>
          <p><b>Stock:</b> {item.stockQty}</p>
          <p><b>Description:</b> {item.description || "—"}</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;