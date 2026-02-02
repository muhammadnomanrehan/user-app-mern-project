// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// import {
//   fetchItems,
//   deleteItem,
// } from "../../../redux/thunks/inventoryThunk/InventoryThunk";
// import {
//   selectItems,
//   selectListLoading,
//   selectDeleting,
//   selectInventory,
// } from "../../../redux/slices/inventorySlices/InventorySlice";

// const InventoryList = () => {
//   const dispatch = useDispatch();
//   const items = useSelector(selectItems);
//   const loading = useSelector(selectListLoading);
//   const deleting = useSelector(selectDeleting);
//   const { errorList } = useSelector(selectInventory);

//   useEffect(() => {
//     dispatch(fetchItems());
//   }, [dispatch]);

//   const onDelete = async (id) => {
//     if (!window.confirm("Delete this item?")) return;
//     const res = await dispatch(deleteItem(id));
//     alert(
//       deleteItem.fulfilled.match(res)
//         ? "Item deleted"
//         : res?.payload || "Failed to delete item",
//     );
//   };

//   const API_BASE =
//     import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
//     "http://localhost:9999";

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900">
//       {/* HEADER */}
//       <div className="mb-5 flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
//           Inventory List
//         </h2>

//         <div className="flex items-center gap-3">
//           <Link
//             to="/inventory/add"
//             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900/40"
//           >
//             + Add Inventory
//           </Link>

//           <button
//             type="button"
//             onClick={() => dispatch(fetchItems())}
//             className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 focus:ring-4 focus:ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-slate-700/40"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* STATUS MESSAGES */}
//       {loading && <div className="mb-3 text-sm text-slate-500">Loading...</div>}

//       {!loading && errorList && (
//         <div className="mb-3 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-900">
//           Error: {errorList}
//         </div>
//       )}

//       {/* TABLE */}
//       {!loading && !errorList && (
//         <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm dark:border-slate-700">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="bg-slate-50 text-left dark:bg-slate-800">
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[10%]">
//                   Image
//                 </th>
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[15%]">
//                   Code
//                 </th>
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[20%]">
//                   Name
//                 </th>
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[15%]">
//                   Category
//                 </th>
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[10%]">
//                   Cost
//                 </th>
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[10%]">
//                   Sell
//                 </th>
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[10%]">
//                   Stock
//                 </th>
//                 <th className="p-3 font-medium text-slate-700 dark:text-slate-200 w-[10%]">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
//               {items?.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="p-5 text-center text-slate-500 dark:text-slate-300"
//                   >
//                     No items found. Click “+ Add Inventory”.
//                   </td>
//                 </tr>
//               ) : (
//                 items.map((i) => {
//                   const isLocalUpload = i.imageUrl?.startsWith("/uploads");
//                   const src = isLocalUpload
//                     ? `${API_BASE}${i.imageUrl}`
//                     : i.imageUrl;

//                   return (
//                     <tr
//                       key={i._id}
//                       className="transition hover:bg-slate-50 dark:hover:bg-slate-800"
//                     >
//                       {/* IMAGE */}
//                       <td className="p-3">
//                         {src ? (
//                           <img
//                             src={src}
//                             alt={i.name}
//                             className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
//                             onError={(e) => {
//                               e.currentTarget.src =
//                                 "https://placehold.co/64x64?text=No+Image";
//                             }}
//                             loading="lazy"
//                           />
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>

//                       <td className="p-3 text-slate-700 dark:text-slate-200">
//                         {i.itemCode}
//                       </td>

//                       <td className="p-3 text-slate-700 dark:text-slate-200">
//                         {i.name}
//                       </td>

//                       <td className="p-3 text-slate-700 dark:text-slate-200">
//                         {i.category}
//                       </td>

//                       <td className="p-3 text-slate-700 dark:text-slate-200">
//                         {i.costPrice}
//                       </td>

//                       <td className="p-3 text-slate-700 dark:text-slate-200">
//                         {i.sellingPrice}
//                       </td>

//                       <td className="p-3 text-slate-700 dark:text-slate-200">
//                         {i.stockQty}
//                       </td>

//                       {/* ACTIONS */}
//                       <td className="p-3">
//                         <div className="flex items-center gap-3">
//                           <Link
//                             to={`/inventory/edit/${i._id}`}
//                             className="text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
//                           >
//                             Edit
//                           </Link>

//                           <button
//                             type="button"
//                             onClick={() => onDelete(i._id)}
//                             disabled={deleting}
//                             className={`text-red-600 transition hover:text-red-700 hover:underline dark:text-red-400 dark:hover:text-red-300 ${
//                               deleting ? "opacity-60 cursor-not-allowed" : ""
//                             }`}
//                           >
//                             Delete
//                           </button>

//                           <Link
//                             to={`/inventory/view/${i._id}`}
//                             className="text-green-600 hover:underline"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryList;



// pagination:
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchItems,
  deleteItem,
} from "../../../redux/thunks/inventoryThunk/InventoryThunk";

import {
  selectItems,
  selectListLoading,
  selectDeleting,
  selectInventory,
} from "../../../redux/slices/inventorySlices/InventorySlice";

const InventoryList = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const loading = useSelector(selectListLoading);
  const deleting = useSelector(selectDeleting);
  const { errorList } = useSelector(selectInventory);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [items]);

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await dispatch(deleteItem(id));
    alert(
      deleteItem.fulfilled.match(res)
        ? "Item deleted"
        : res?.payload || "Failed to delete item"
    );
  };

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
    "http://localhost:9999";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">
          Inventory List
        </h2>

        <div className="flex items-center gap-3">
          <Link
            to="/inventory/add"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
          >
            + Add Inventory
          </Link>

          <button
            onClick={() => dispatch(fetchItems())}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* STATUS */}
      {loading && (
        <div className="mb-4 text-sm text-slate-500">Loading inventory…</div>
      )}

      {!loading && errorList && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errorList}
        </div>
      )}

      {/* TABLE */}
      {!loading && !errorList && (
        <>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Image</th>
                  <th className="px-4 py-3 text-left font-medium">Code</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Cost</th>
                  <th className="px-4 py-3 text-left font-medium">Sell</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                      No items found
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((i) => {
                    const src = i.imageUrl?.startsWith("/uploads")
                      ? `${API_BASE}${i.imageUrl}`
                      : i.imageUrl;

                    return (
                      <tr
                        key={i._id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-4 py-3">
                          <img
                            src={src}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {i.itemCode}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {i.name}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {i.category}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {i.costPrice}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {i.sellingPrice}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {i.stockQty}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/inventory/edit/${i._id}`}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </Link>

                            <button
                              disabled={deleting}
                              onClick={() => onDelete(i._id)}
                              className="text-red-600 hover:underline disabled:opacity-50"
                            >
                              Delete
                            </button>

                            <Link
                              to={`/inventory/view/${i._id}`}
                              className="text-green-600 hover:underline"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {items.length > itemsPerPage && (
            <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
              <span>
                Showing {(startIndex + 1)}–
                {Math.min(startIndex + itemsPerPage, items.length)} of{" "}
                {items.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="rounded-lg border px-3 py-1 hover:bg-slate-100 disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="font-medium">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="rounded-lg border px-3 py-1 hover:bg-slate-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InventoryList;