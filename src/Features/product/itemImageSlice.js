
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getItemImage} from '../../Services/api/productApi'

export const fetchItemImages = createAsyncThunk('itemImages/fetchItemImages', async () => {
  const response = await getItemImage();
  return response.data;
});

const itemImageSlice = createSlice({
  name: 'itemImages',
  initialState: {
    images: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItemImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchItemImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default itemImageSlice.reducer;
