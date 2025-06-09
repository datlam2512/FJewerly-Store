import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDiscountAll } from '../../Services/api/DiscountApi';
export const fetchDiscountData = createAsyncThunk(
  "fetchDiscountData",
  async () => {
  const response = await getDiscountAll();
  return response.data
  }
);
const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    discountData: [],
    isLoadingDiscountData: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountData.pending, (state,action) => {
       state.isLoadingDiscountData=true;
       state.isError=false;
      })
      .addCase(fetchDiscountData.fulfilled, (state, action) => {
        state.discountData = action.payload;
        state.isLoadingDiscountData = false;
        state.isError=false;
      })
      .addCase(fetchDiscountData.rejected, (state) => {
        state.isError = true;
        state.isLoadingDiscountData = false;
      });
  },
});

export default discountSlice.reducer;
