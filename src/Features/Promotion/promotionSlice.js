// src/features/Promotion/promotionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {requestPromotion} from '../../Services/api/promotionApi'

export const requestPromotionCus = createAsyncThunk(
  'promotion/requestPromotionCus',
  async ({ id, code, discountPct, status, cusID,description }) => {
    const response = await requestPromotion(id, code, discountPct, status, cusID,description );
    return response.data;
  }
);

const promotionSlice = createSlice({
  name: 'promotion',
  initialState: {
    promotion: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestPromotionCus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestPromotionCus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.promotion = action.payload;
      })
      .addCase(requestPromotionCus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default promotionSlice.reducer;
