// src/Features/Rewards/rewardsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getRewardAll} from '../../Services/api/CustomerSApi'

export const fetchRewardAll = createAsyncThunk('rewards/fetchRewardAll', async () => {
  const response = await getRewardAll();
  return response.data;
});

const rewardsallSlice = createSlice({
  name: 'rewardsAll',
  initialState: {
    rewardsallData: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewardAll.fulfilled, (state, action) => {
        state.loading = false;
        state.rewardsallData = action.payload;
      })
      .addCase(fetchRewardAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default rewardsallSlice.reducer;
