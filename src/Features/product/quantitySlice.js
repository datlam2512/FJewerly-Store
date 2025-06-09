import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reduceitem } from '../../Services/api/productApi';

// Async thunk for reducing item quantity
export const reduceItemQuantity = createAsyncThunk(
  'quantity/reduceItemQuantity',
  async ({ itemId, quantity }) => {
    const response = await reduceitem(itemId,quantity);
    return response.data;
  }
);

const quantitySlice = createSlice({
  name: 'quantity',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(reduceItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reduceItemQuantity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(reduceItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default quantitySlice.reducer;
