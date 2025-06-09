
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductImage = createAsyncThunk(
  'productImage/fetchProductImage',
  async (itemId) => {
    const response = await axios.get(`/api/ItemImage/${itemId}`);
    return response.data;
  }
);

const productImageSlice = createSlice({
  name: 'productImage',
  initialState: {
    image: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.image = action.payload;
      })
      .addCase(fetchProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default productImageSlice.reducer;
