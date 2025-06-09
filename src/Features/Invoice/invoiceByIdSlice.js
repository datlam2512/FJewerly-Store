import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {GetInvoicewithId} from '../../Services/api/InvoiceApi'


export const fetchInvoiceById = createAsyncThunk(
  'invoice/fetchById',
  async (id) => {
    const response = await GetInvoicewithId(id);
    return response.data;
  }
);

const invoiceByIdSlice = createSlice({
  name: 'invoiceById',
  initialState: {
    invoiceIdDetail: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceIdDetail = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default invoiceByIdSlice.reducer;
