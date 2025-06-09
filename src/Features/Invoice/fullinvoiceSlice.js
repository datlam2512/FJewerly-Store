import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getinvoiceAll} from '../../Services/api/InvoiceApi'

export const fetchAllInvoice = createAsyncThunk('invoice/fetchLatest', async () => {
  const response = await getinvoiceAll();
  return response.data;
});

const invoicefullSlice = createSlice({
  name: 'invoicefull',
  initialState: {
    allInvoice: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInvoice.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllInvoice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allInvoice = action.payload;
      })
      .addCase(fetchAllInvoice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default invoicefullSlice.reducer;
