
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {rewardDetailCustomer} from '../../Services/api/CustomerSApi'
export const fetchRewardDetail = createAsyncThunk(
  'rewards/fetchRewardDetail',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await rewardDetailCustomer(customerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const rewardDetailSlice = createSlice({
  name: 'rewards',
  initialState: {
    rewardDetail: null,
    isrewardLoading: false,
    isrewardetailError: false,
    errorMessage: '',
  },
  reducers: {
    clearRewardDetail: (state) => {
      state.rewardDetail = null;
      state.isrewardLoading = false;
      state.isrewardetailError = false;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardDetail.pending, (state) => {
        state.isrewardLoading = true;
        state.isrewardetailError = false;
        state.errorMessage = '';
      })
      .addCase(fetchRewardDetail.fulfilled, (state, action) => {
        state.isrewardLoading = false;
        state.rewardDetail = action.payload;
      })
      .addCase(fetchRewardDetail.rejected, (state, action) => {
        state.isrewardLoading = false;
        state.isrewardetailError = true;
        state.errorMessage = action.payload || 'Failed to fetch reward details';
      });
  },
});

export const { clearRewardDetail } = rewardDetailSlice.actions;

export default rewardDetailSlice.reducer;
