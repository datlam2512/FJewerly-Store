// src/Features/product/productDetailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomerByPhone } from '../../Services/api/CustomerSApi'; 

export const fetchCustomerPhone = createAsyncThunk(
  'customerDetail/fetchCustomerPhone',
  async (phoneNumber, thunkAPI) => {
    try {
      const response = await getCustomerByPhone(phoneNumber);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const customerPhoneSlice = createSlice({
  name: 'customerPhone',
  initialState: {
    cutomerPhoneData: null,
    isLoadingcustomerPhoneData: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPhone.pending, (state) => {
        state.isLoadingcustomerPhoneData = true;
        state.isError = false;
      })
      .addCase(fetchCustomerPhone.fulfilled, (state, action) => {
        state.cutomerPhoneData = action.payload;
        state.isLoadingcustomerPhoneData = false;
      })
      .addCase(fetchCustomerPhone.rejected, (state) => {
        state.isLoadingcustomerPhoneData = false;
        state.isError = true;
      });
  },
});

export default customerPhoneSlice.reducer;
