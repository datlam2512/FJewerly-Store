import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getwarrantyall } from '../../Services/api/warrantyApi';

export const fetchLatestWarranty = createAsyncThunk(
  'warranty/fetchLatestWarranty',
  async () => {
    const response = await getwarrantyall();
    const warranties = response.data;

    // Sort warranties by date in descending order
    const sortedWarranties = warranties.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
    
    // Return the latest warranty
    return sortedWarranties.length > 0 ? sortedWarranties[0] : null;
  }
);

const warrantySlice = createSlice({
  name: 'warrantyall',
  initialState: {
    latestWarranty: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestWarranty.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLatestWarranty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.latestWarranty = action.payload;
      })
      .addCase(fetchLatestWarranty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default warrantySlice.reducer;
