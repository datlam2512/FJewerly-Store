import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getAllBuyBack} from '../../Services/api/productApi'
import { fetchItemImages } from './itemImageSlice';
export const fetchProductBuyBackData = createAsyncThunk(
  "fetchProductBuyBackData",
  async (_, { dispatch }) => {
  const response = await getAllBuyBack();
  dispatch(fetchItemImages());
  return response.data
  }
);
const productBuyBackSlice = createSlice({
  name: 'productBuyBack',
  initialState: {
    producBuyBacktData: [],
    isLoadingProductData: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductBuyBackData.pending, (state,action) => {
       state.isLoadingProductData=true;
       state.isError=false;
      })
      .addCase(fetchProductBuyBackData.fulfilled, (state, action) => {
        state.producBuyBacktData = action.payload;
        state.isLoadingProductData = false;
        state.isError=false;
      })
      .addCase(fetchProductBuyBackData.rejected, (state) => {
        state.isError = true;
        state.isLoadingProductData = false;
      });
  },
});

export default productBuyBackSlice.reducer;
