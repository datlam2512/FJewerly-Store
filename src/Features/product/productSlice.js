import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getProductAll} from '../../Services/api/productApi'
import { fetchItemImages } from './itemImageSlice';
export const fetchProductData = createAsyncThunk(
  "fetchProductData",
  async (_, { dispatch }) => {
  const response = await getProductAll();
  dispatch(fetchItemImages());
  return response.data
  }
);
const productSlice = createSlice({
  name: 'product',
  initialState: {
    productData: [],
    isLoadingProductData: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductData.pending, (state,action) => {
       state.isLoadingProductData=true;
       state.isError=false;
      })
      .addCase(fetchProductData.fulfilled, (state, action) => {
        state.productData = action.payload;
        state.isLoadingProductData = false;
        state.isError=false;
      })
      .addCase(fetchProductData.rejected, (state) => {
        state.isError = true;
        state.isLoadingProductData = false;
      });
  },
});

export default productSlice.reducer;
