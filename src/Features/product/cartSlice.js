import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDiscountData } from "../Discount/DiscountSlice";

const initialState = {
  cartItems: [],
  customerInfo: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  discount: 0,
  discountspecial: 0,
};

const cartSlice = createSlice({
  name: 'SaleCart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = { ...action.payload, itemQuantity: 1 };
      const itemExists = state.cartItems.find(item => item.itemId === newItem.itemId);
      if (itemExists) {
        itemExists.itemQuantity += 1;
      } else {
        state.cartItems.push(newItem);
      }
    },
    removeItem: (state, action) => {
      const itemIdToRemove = action.payload;
      state.cartItems = state.cartItems.filter(item => item.itemId !== itemIdToRemove);
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find(item => item.itemId === itemId);
      if (item) {
        item.itemQuantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find(item => item.itemId === itemId);
      if (item) {
        item.itemQuantity -= 1;
        if (item.itemQuantity < 1) {
          state.cartItems = state.cartItems.filter(item => item.itemId !== itemId);
        }
      }
    },
    updateTotals: (state, action) => {
      state.cartTotalQuantity = action.payload.cartTotalQuantity;
      state.cartTotalAmount = action.payload.cartTotalAmount;
      state.discount = action.payload.discount;
      state.discountspecial = action.payload.discountspecial;
    },
    updateCustomerInfo(state, action) {
      state.customerInfor = action.payload;
    },
    resetCart(state) {
      state.cartItems = [];
      state.customerInfo = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      state.discount = 0;
      state.discountspecial = 0;
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  incrementQuantity, 
  decrementQuantity, 
  updateTotals, 
  updateCustomerInfo, 
  resetCart 
} = cartSlice.actions;
export default cartSlice.reducer;
