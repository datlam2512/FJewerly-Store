import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { edititem } from '../../Services/api/productApi';

export const editProduct = createAsyncThunk(
  'product/editProduct',
  async ({ itemId, productDetails }, { rejectWithValue }) => {
    try {
      const response = await edititem(itemId, productDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productEditSlice = createSlice({
  name: 'productEdit',
  initialState: {
    product: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetProductState: (state) => {
      state.product = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productEditSlice.actions;
export default productEditSlice.reducer;
