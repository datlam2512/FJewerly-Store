import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  customerInfor: [],
  customerId: '',
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  invoiceNumber: "",
};

const buyBackCartSlice = createSlice({
  name: 'buyBackCart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(item => item.itemId === newItem.itemId);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cartItems.push({
          ...newItem,
          maxQuantity: newItem.quantity,
        });
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.itemId === action.payload);
      if (item && item.quantity < item.maxQuantity) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.itemId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeItem: (state, action) => {
      const itemIdToRemove = action.payload;
      state.cartItems = state.cartItems.filter(item => item.itemId !== itemIdToRemove);
    },
    updateTotals: (state, action) => {
      state.cartTotalQuantity = action.payload.cartTotalQuantity;
      state.cartTotalAmount = action.payload.cartTotalAmount;
    },
    updateCustomerInfo(state, action) {
      state.customerInfor = action.payload;
    },
    updateCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
    updateInvoiceNumber: (state, action) => {
      state.invoiceNumber = action.payload;
    },
    resetCustomerId: (state) => {
      state.customerId = '';
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.customerInfor = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.customerId = '';
      state.invoiceNumber = '';
    },
  },
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity, updateTotals, updateCustomerInfo, resetCart, updateCustomerId, resetCustomerId, updateInvoiceNumber } = buyBackCartSlice.actions;
export default buyBackCartSlice.reducer;
