import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import toastReducer from "./toastSlice"; // Import toastReducer

// Configure Redux store
const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    toast: toastReducer, // Add toastReducer to the store
  },
});

export default store;
