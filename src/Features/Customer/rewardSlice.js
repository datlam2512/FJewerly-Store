// Features/reward/rewardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rewardCustomer as rewardCustomerAPI } from '../../Services/api/CustomerSApi';

export const rewardCustomer = createAsyncThunk('reward/rewardCustomer', async ({ customerId, addPoints }) => {
  const response = await rewardCustomerAPI(customerId, addPoints);
  return response;
});

const rewardSlice = createSlice({
  name: 'reward',
  initialState: {
    rewardStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(rewardCustomer.pending, (state) => {
        state.rewardStatus = 'loading';
      })
      .addCase(rewardCustomer.fulfilled, (state) => {
        state.rewardStatus = 'succeeded';
      })
      .addCase(rewardCustomer.rejected, (state, action) => {
        state.rewardStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export default rewardSlice.reducer;
