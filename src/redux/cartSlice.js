import { createSlice } from "@reduxjs/toolkit";

// Initial state loaded from localStorage
const initialState = JSON.parse(localStorage.getItem("cart")) || [];

// Redux slice for cart state management
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const productToAdd = action.payload;
      const existingItem = state.find((item) => item.id === productToAdd.id);

      if (existingItem) {
        // Increment quantity if product already in cart, check stock
        if (existingItem.quantity < productToAdd.stock) {
          existingItem.quantity += 1;
          existingItem.totalPrice =
            existingItem.quantity * existingItem.price_at_purchase;
        } else {
          // Optionally, add a notification about insufficient stock
          console.warn(
            `Cannot add more of ${productToAdd.name}: insufficient stock.`
          );
          // You might want to dispatch another action here for a global notification
        }
      } else {
        // Add new product to cart with quantity 1, check stock
        if (productToAdd.stock > 0) {
          state.push({
            ...productToAdd,
            quantity: 1,
            price_at_purchase: productToAdd.price, // Store price at time of adding to cart
            totalPrice: productToAdd.price, // Initial total price for 1 quantity
          });
        } else {
          console.warn(`Cannot add ${productToAdd.name}: out of stock.`);
        }
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const updatedCart = state.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemToUpdate = state.find((item) => item.id === id);
      if (itemToUpdate) {
        // Update quantity and recalculate totalPrice
        itemToUpdate.quantity = quantity;
        itemToUpdate.totalPrice =
          itemToUpdate.quantity * itemToUpdate.price_at_purchase;
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    // Menambahkan reducer untuk menghapus semua item dari keranjang
    clearCart: (state) => {
      localStorage.removeItem("cart"); // Hapus data keranjang dari localStorage
      return []; // Kembalikan state kosong
    },
  },
});

export const { addToCart, removeFromCart, updateItemQuantity, clearCart } =
  cartSlice.actions; // Tambahkan `clearCart` di export
export default cartSlice.reducer;
