import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getinvoiceAll} from '../../Services/api/InvoiceApi'

export const fetchLatestInvoice = createAsyncThunk('invoice/fetchLatest', async () => {
  const response = await getinvoiceAll();
  const invoices = response.data;
  return invoices[invoices.length - 2]; 
});

const invoiceSalllice = createSlice({
  name: 'invoiceAll',
  initialState: {
    latestInvoice: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestInvoice.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLatestInvoice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.latestInvoice = action.payload;
      })
      .addCase(fetchLatestInvoice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default invoiceSalllice.reducer;
