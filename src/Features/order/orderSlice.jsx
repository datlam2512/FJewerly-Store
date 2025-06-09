import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getinvoiceAll } from '../../Services/api/InvoiceApi'

export const fetchAllOrder = createAsyncThunk('invoice/fetchLatest', async () => {
    const response = await getinvoiceAll();
    return response.data;
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        allOrder: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allOrder = action.payload;
            })
            .addCase(fetchAllOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default orderSlice.reducer;
