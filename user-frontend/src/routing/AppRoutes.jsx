// import React from "react";
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// import About from "../pages/about/AboutUs";
// import Contact from "../pages/contact/ContactUs";
// import Home from "../components/shared/Home";
// import Navbar from "../components/shared/Navbar";
// import { Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import ForgetPassword from "../pages/auth/ForgetPassword";
// import ResetPassword from "../pages/auth/ResetPassword";
// import VerifyOtp from "../pages/auth/VerifyOtp";

// const AppRoutes = () => {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgetPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />

//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />

//         {/* Protected */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/home" element={<Home />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </>
//   );
// };

// export default AppRoutes;





import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import ProtectedRoute from "./ProtectedRoute";
// optional role guard
// import RoleRoute from "./guards/RoleRoute";

// pages
import Home from "../components/shared/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import About from "../pages/about/AboutUs";
import Contact from "../pages/contact/ContactUs";
// inventory module
import InventoryList from "../features/inventory/pages/InventoryList";
import PurchaseInvoice from "../features/inventory/pages/PurchaseInvoice";
import InventoryLayout from "../features/inventory/InventoryLAyout";

const AppRoutes = () => {
  return (
    <>
      <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

          {/* Protected area */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />

            {/* Inventory (nested). If role limit needed, wrap with RoleRoute */}
            {/* <Route element={<RoleRoute allowed={['master','admin']} />}> */}
              <Route path="/inventory" element={<InventoryLayout />}>
                <Route index element={<Navigate to="list" replace />} />
                <Route path="list" element={<InventoryList />} />
                <Route path="purchase-invoice" element={<PurchaseInvoice />} />
              </Route>
            {/* </Route> */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </>
  );
};

export default AppRoutes;
