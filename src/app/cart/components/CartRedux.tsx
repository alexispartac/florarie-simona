'use client';
import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { CartItem, CartState } from '../types';


// Preluăm produsele salvate în localStorage sau setăm un array gol
const initialState: CartState = {
  items: [], // Inițial, setăm un array gol
};

// Creăm slice-ul pentru coșul de cumpărături
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Salvăm în localStorage
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Actualizăm localStorage
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Actualizăm localStorage
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartItems'); // Golim localStorage
      }
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

// Exportăm acțiunile
export const { addItem, removeItem, updateQuantity, clearCart, setCart } = cartSlice.actions;

// Creăm store-ul Redux
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

// Exportăm tipurile pentru utilizare în aplicație
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;