import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import buyBackApi from "../../Services/api/buyBackApi";

export const fetchCustomerData = createAsyncThunk(
    "fetchCustomerData",
    async () => {
      try {
        const response = await buyBackApi.getCustomerInforApi();
        return response;
      } catch (error) {
        console.error("Failed to fetch customer data", error);
        throw error;
      }
    }
  );

const buyBackCustomerSlice = createSlice({
    name: 'buyBackCustomer',
    initialState: {
      customerData: [],
      isLoading: false,
      isError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
       .addCase(fetchCustomerData.pending, (state, action) => {
          state.isLoading = true;
          state.isError = false;
        })
       .addCase(fetchCustomerData.fulfilled, (state, action) => {
          state.customerData = action.payload;
          state.isLoading = false;
          state.isError = false;
        })
       .addCase(fetchCustomerData.rejected, (state) => {
          state.isError = true;
          state.isLoading = false;
        });
    },
  });

  export default buyBackCustomerSlice.reducer;


