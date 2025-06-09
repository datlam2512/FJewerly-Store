import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addinvoice } from '../../Services/api/InvoiceApi';

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await addinvoice(
        invoiceData.staffId,
        invoiceData.returnPolicyId,
        invoiceData.itemId,
        invoiceData.customerId,
        invoiceData.companyName,
        invoiceData.buyerAddress,
        invoiceData.status,
        invoiceData.paymentType,
        invoiceData.quantity,
        invoiceData.subTotal
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoice: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceSlice.reducer;