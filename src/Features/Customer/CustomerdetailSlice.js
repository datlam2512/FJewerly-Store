import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomerById } from '../../Services/api/CustomerSApi';

export const fetchCustomerDetail = createAsyncThunk(
  'customerDetail/fetchCustomerDetail',
  async (id, thunkAPI) => {
    try {
      const response = await getCustomerById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const customerDetailSlice = createSlice({
  name: 'customerDetail',
  initialState: {
    customerDataDetail: null,
    isLoadingCustomerDetail: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerDetail.pending, (state) => {
        state.isLoadingCustomerDetail = true;
        state.isError = false;
      })
      .addCase(fetchCustomerDetail.fulfilled, (state, action) => {
        state.customerDataDetail = action.payload;
        state.isLoadingCustomerDetail = false;
      })
      .addCase(fetchCustomerDetail.rejected, (state) => {
        state.isLoadingCustomerDetail = false;
        state.isError = true;
      });
  },
});

export default customerDetailSlice.reducer;
