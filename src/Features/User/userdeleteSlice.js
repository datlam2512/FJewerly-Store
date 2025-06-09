import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { removeuser } from '../../Services/api/UsersApi';

export const deleteUser = createAsyncThunk('users/deleteUser', async (staffId, thunkAPI) => {
  try {
    const response = await removeuser(staffId);
    return staffId;
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

const userRemoveSlice = createSlice({
  name: 'userRemove',
  initialState: {
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      });
  },
});

export default userRemoveSlice.reducer;
