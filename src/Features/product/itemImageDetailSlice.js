import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ItemimageDetail } from '../../Services/api/productApi';

export const fetchItemImage = createAsyncThunk('itemImage/fetchItemImage', async ({ itemId, count }) => {
  const response = await ItemimageDetail(itemId, count);
  return response.data;
});

const itemImageSlice = createSlice({
  name: 'itemImageDetail',
  initialState: {
    itemImageDataDetail: null,
    isLoading: false,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemImage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchItemImage.fulfilled, (state, action) => {
        state.itemImageDataDetail = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchItemImage.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default itemImageSlice.reducer;
