import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addItem } from '../../Services/api/productApi';

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (productDetails, { rejectWithValue }) => {
    try {
      const response = await addItem(productDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productAddSlice = createSlice({
  name: 'productAdd',
  initialState: {
    product: [],
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
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productAddSlice.actions;
export default productAddSlice.reducer;
