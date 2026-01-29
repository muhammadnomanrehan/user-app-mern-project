
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-md text-sm ${
    isActive ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
  }`;

const InventoryLayout = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Inventory</h1>

      <nav className="flex gap-2 mb-4">
        <NavLink to="list" className={tabClass}>
          Inventory List
        </NavLink>
        <NavLink to="purchase-invoice" className={tabClass}>
          Purchase Invoice
        </NavLink>
      </nav>

      {/* Children render here */}
      <Outlet />
    </div>
  );
};

export default InventoryLayout;
