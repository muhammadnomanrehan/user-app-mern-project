// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addItem,
//   checkItemCode,
// } from "../../../redux/thunks/inventoryThunk/InventoryThunk";
// import {
//   selectDupCheck,
//   selectSubmitting,
// } from "../../../redux/slices/inventorySlices/InventorySlice";

// const categories = [
//   "Food",
//   "Beverage",
//   "Grocery",
//   "Electronics",
//   "Clothing",
//   "Bakery",
//   "Cosmetics",
//   "Other",
// ];

// const AddInventory = () => {
//   const dispatch = useDispatch();
//   const submitting = useSelector(selectSubmitting);
//   const dupCheck = useSelector(selectDupCheck);

//   const [values, setValues] = useState({
//     itemCode: "",
//     name: "",
//     category: "Food",
//     costPrice: 0,
//     sellingPrice: 0,
//     stockQty: 0,
//     description: "",
//     imageFile: null,
//   });

//   // Duplicate check (debounced)
//   useEffect(() => {
//     const t = setTimeout(() => {
//       const code = values.itemCode?.trim();
//       if (code) dispatch(checkItemCode(code));
//     }, 500);
//     return () => clearTimeout(t);
//   }, [values.itemCode, dispatch]);

//   const onChangeText = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const onChangeNumber = (e) => {
//     const { name, value } = e.target;
//     setValues((prev) => ({ ...prev, [name]: Number(value) }));
//   };

//   const onChangeFile = (e) => {
//     const file = e.target.files?.[0] || null;
//     setValues((prev) => ({ ...prev, imageFile: file }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (dupCheck.exists && dupCheck.itemCode === values.itemCode) {
//       alert("Item code already exists. Please choose a different code.");
//       return;
//     }

//     const fd = new FormData();
//     fd.append("itemCode", values.itemCode);
//     fd.append("name", values.name);
//     fd.append("category", values.category);
//     fd.append("costPrice", String(values.costPrice));
//     fd.append("sellingPrice", String(values.sellingPrice));
//     fd.append("stockQty", String(values.stockQty));
//     fd.append("description", values.description || "");
//     if (values.imageFile) fd.append("image", values.imageFile); // MUST be "image"

//     const res = await dispatch(addItem(fd));
//     if (addItem.fulfilled.match(res)) {
//       alert("Inventory item added successfully!");
//       setValues({
//         itemCode: "",
//         name: "",
//         category: "Food",
//         costPrice: 0,
//         sellingPrice: 0,
//         stockQty: 0,
//         description: "",
//         imageFile: null,
//       });
//     } else {
//       const msg =
//         res.payload ||
//         res.error?.message ||
//         "Error adding item. Please try again.";
//       alert(msg);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900">
//         <div className="mb-6 flex items-center justify-between">
//           <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
//             Add Inventory
//           </h2>
//           {/* Optional badge for status */}
//           {submitting && (
//             <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800">
//               Saving...
//             </span>
//           )}
//         </div>

//         <form onSubmit={onSubmit} className="space-y-6">
//           {/* Grid: 60% / 40% */}
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-[3fr_2fr]">
//             {/* LEFT */}
//             <div className="space-y-4">
//               {/* Item Code */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                   Item Code <span className="text-rose-500">*</span>
//                 </label>
//                 <input
//                   name="itemCode"
//                   value={values.itemCode}
//                   onChange={onChangeText}
//                   required
//                   className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                   placeholder="e.g. P-1001"
//                 />
//                 {dupCheck.itemCode === values.itemCode && dupCheck.exists && (
//                   <p className="mt-1 text-xs font-medium text-rose-600">
//                     This item code already exists.
//                   </p>
//                 )}
//               </div>

//               {/* Name */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                   Name <span className="text-rose-500">*</span>
//                 </label>
//                 <input
//                   name="name"
//                   value={values.name}
//                   onChange={onChangeText}
//                   required
//                   className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                   placeholder="Product name"
//                 />
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   value={values.category}
//                   onChange={onChangeText}
//                   required
//                   className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                 >
//                   {categories.map((c) => (
//                     <option key={c} value={c}>
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Prices */}
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                     Cost Price
//                   </label>
//                   <input
//                     type="number"
//                     name="costPrice"
//                     min={0}
//                     value={values.costPrice}
//                     onChange={onChangeNumber}
//                     required
//                     className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                     placeholder="0"
//                   />
//                 </div>
//                 <div>
//                   <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                     Selling Price
//                   </label>
//                   <input
//                     type="number"
//                     name="sellingPrice"
//                     min={0}
//                     value={values.sellingPrice}
//                     onChange={onChangeNumber}
//                     required
//                     className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                     placeholder="0"
//                   />
//                 </div>
//               </div>

//               {/* Stock Qty */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                   Stock Qty
//                 </label>
//                 <input
//                   type="number"
//                   name="stockQty"
//                   min={0}
//                   value={values.stockQty}
//                   onChange={onChangeNumber}
//                   required
//                   className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                   placeholder="0"
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                   Description (optional)
//                 </label>
//                 <textarea
//                   name="description"
//                   value={values.description}
//                   onChange={onChangeText}
//                   rows={4}
//                   className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                   placeholder="Short details about the item…"
//                 />
//               </div>
//             </div>

//             {/* RIGHT */}
//             <div className="flex flex-col">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
//                   Image (jpg/png/webp)
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={onChangeFile}
//                   className="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
//                 />
//               </div>

//               {values.imageFile && (
//                 <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
//                   <img
//                     src={URL.createObjectURL(values.imageFile)}
//                     alt="Preview"
//                     className="h-auto w-full"
//                   />
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900/40"
//               >
//                 {submitting ? (
//                   <span className="inline-flex items-center gap-2">
//                     <svg
//                       className="h-4 w-4 animate-spin"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                       />
//                     </svg>
//                     Saving...
//                   </span>
//                 ) : (
//                   "Save"
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddInventory;
// ``



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  addItem,
  updateItem,
  checkItemCode,
  fetchItemById,
} from "../../../redux/thunks/inventoryThunk/InventoryThunk";

import {
  selectDupCheck,
  selectSubmitting,
  selectCurrentItem,
} from "../../../redux/slices/inventorySlices/InventorySlice";

const categories = [
  "Food",
  "Beverage",
  "Grocery",
  "Electronics",
  "Clothing",
  "Bakery",
  "Cosmetics",
  "Other",
];

const AddInventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const submitting = useSelector(selectSubmitting);
  const dupCheck = useSelector(selectDupCheck);
  const currentItem = useSelector(selectCurrentItem);

  const [values, setValues] = useState({
    itemCode: "",
    name: "",
    category: "Food",
    costPrice: "",
    sellingPrice: "",
    stockQty: "",
    description: "",
    imageFile: null,
  });

  /* ================= FETCH ITEM (EDIT) ================= */
  useEffect(() => {
    if (isEdit) dispatch(fetchItemById(id));
  }, [isEdit, id, dispatch]);

  /* ================= PREFILL FORM ================= */
  useEffect(() => {
    if (isEdit && currentItem) {
      setValues({
        itemCode: currentItem.itemCode,
        name: currentItem.name,
        category: currentItem.category,
        costPrice: currentItem.costPrice,
        sellingPrice: currentItem.sellingPrice,
        stockQty: currentItem.stockQty,
        description: currentItem.description || "",
        imageFile: null,
      });
    }
  }, [isEdit, currentItem]);

  /* ================= DUP CHECK (ONLY ADD) ================= */
  useEffect(() => {
    if (isEdit) return;

    const t = setTimeout(() => {
      const code = values.itemCode?.trim();
      if (code) dispatch(checkItemCode(code));
    }, 500);

    return () => clearTimeout(t);
  }, [values.itemCode, isEdit, dispatch]);

  const onChangeText = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeNumber = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const onChangeFile = (e) => {
    const file = e.target.files?.[0] || null;
    setValues((prev) => ({ ...prev, imageFile: file }));
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && dupCheck.exists && dupCheck.itemCode === values.itemCode) {
      alert("Item code already exists.");
      return;
    }

    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("category", values.category);
    fd.append("costPrice", String(values.costPrice));
    fd.append("sellingPrice", String(values.sellingPrice));
    fd.append("stockQty", String(values.stockQty));
    fd.append("description", values.description || "");

    if (!isEdit) fd.append("itemCode", values.itemCode);
    if (values.imageFile) fd.append("image", values.imageFile);

    const res = isEdit
      ? await dispatch(updateItem({ id, formData: fd }))
      : await dispatch(addItem(fd));

    if (addItem.fulfilled.match(res) || updateItem.fulfilled.match(res)) {
      navigate("/inventory/list");
    } else {
      alert(res.payload || res.error?.message || "Operation failed");
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl rounded border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {isEdit ? "Edit Inventory" : "Add Inventory"}
        </h2>

        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Item Code</label>
              <input
                name="itemCode"
                value={values.itemCode}
                onChange={onChangeText}
                disabled={isEdit}
                required
                className="mt-1 w-full rounded border px-3 py-2"
              />
              {!isEdit &&
                dupCheck.exists &&
                dupCheck.itemCode === values.itemCode && (
                  <p className="text-xs text-red-600 mt-1">
                    Item code already exists
                  </p>
                )}
            </div>

            <div>
              <label className="text-sm font-medium">Item Name</label>
              <input
                name="name"
                value={values.name}
                onChange={onChangeText}
                required
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                value={values.category}
                onChange={onChangeText}
                className="mt-1 w-full rounded border px-3 py-2"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Cost Price</label>
              <input
                type="number"
                name="costPrice"
                value={values.costPrice}
                onChange={onChangeNumber}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Selling Price</label>
              <input
                type="number"
                name="sellingPrice"
                value={values.sellingPrice}
                onChange={onChangeNumber}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock Quantity</label>
              <input
                type="number"
                name="stockQty"
                value={values.stockQty}
                onChange={onChangeNumber}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={values.description}
                onChange={onChangeText}
                rows={3}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <label className="text-sm font-medium">Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={onChangeFile}
              className="mt-2"
            />

            {values.imageFile && (
              <img
                src={URL.createObjectURL(values.imageFile)}
                alt="preview"
                className="mt-3 max-h-48 rounded border"
              />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded bg-blue-600 py-2 text-white"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventory;