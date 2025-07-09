import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice'; // ✅ updated path
import authReducer from './slices/authSlice'; // ✅ updated path

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

