import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { removeItem } from '../../Services/api/productApi';


export const removeProduct = createAsyncThunk(
  'products/removeProduct',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await removeItem(itemId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the item from the items array
        state.items = state.items.filter(item => item.id !== action.meta.arg);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export the async thunk and the reducer
export const { reducer: productReducer } = productSlice;
export default productReducer;
