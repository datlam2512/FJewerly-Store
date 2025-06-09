import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addItem } from '../../Services/api/productApi';
import userkApi from '../../Services/api/UserApi';

export const addUser = createAsyncThunk(
  'user/addUser',
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await userkApi.createUser(userDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userAddSlice = createSlice({
  name: 'userAdd',
  initialState: {
    user: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState } = userAddSlice.actions;
export default userAddSlice.reducer;
