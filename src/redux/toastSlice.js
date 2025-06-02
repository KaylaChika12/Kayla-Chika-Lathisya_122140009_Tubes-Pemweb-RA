import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
  type: "info", // 'success', 'error', 'warning', 'info'
  isVisible: false,
};

// Redux slice for managing global toast notifications
const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.isVisible = true;
    },
    hideToast: (state) => {
      state.isVisible = false;
      state.message = null; // Clear message when hidden
      state.type = "info"; // Reset type
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
