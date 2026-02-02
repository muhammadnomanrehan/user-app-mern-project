
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices/AuthSlice"
import inventoryReducer from "./slices/inventorySlices/InventorySlice" 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer, 

  },
 
});
