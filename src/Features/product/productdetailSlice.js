// src/Features/product/productDetailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProductById } from '../../Services/api/productApi'; 

export const fetchProductDetail = createAsyncThunk(
  'productDetail/fetchProductDetail',
  async (itemId, thunkAPI) => {
    try {
      const response = await getProductById(itemId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState: {
    productDataDetail: [],
    isLoadingProductDetail: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoadingProductDetail = true;
        state.isError = false;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.productDataDetail = action.payload;
        state.isLoadingProductDetail = false;
      })
      .addCase(fetchProductDetail.rejected, (state) => {
        state.isLoadingProductDetail = false;
        state.isError = true;
      });
  },
});

export default productDetailSlice.reducer;
