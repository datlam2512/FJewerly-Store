import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {addwwarranty} from '../../Services/api/warrantyApi'


export const addWarranty = createAsyncThunk(
  'warranty/addWarranty',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await addwwarranty(customerId)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const warrantySlice = createSlice({
  name: 'warranty',
  initialState: {
    warranty: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWarranty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWarranty.fulfilled, (state, action) => {
        state.loading = false;
        state.warranty = action.payload;
      })
      .addCase(addWarranty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default warrantySlice.reducer;
