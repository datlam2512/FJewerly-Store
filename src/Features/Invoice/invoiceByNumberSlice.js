import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {GetinvoiceWithserailnumber} from '../../Services/api/InvoiceApi'

export const fetchInvoiceByNumber = createAsyncThunk(
  'invoice/fetchByNumber',
  async (invoiceNumber) => {
    const response = await GetinvoiceWithserailnumber(invoiceNumber);
    return response.data;
  }
);

const invoiceByNumberSlice = createSlice({
  name: 'invoiceByNumber',
  initialState: {
    invoiceDetail: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceDetail = action.payload;
      })
      .addCase(fetchInvoiceByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default invoiceByNumberSlice.reducer;
