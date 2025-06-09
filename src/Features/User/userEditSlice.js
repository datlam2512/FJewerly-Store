// Features/User/userEditSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import{edituser} from '../../Services/api/UsersApi'
// Define the async thunk for editing user details
export const editUser = createAsyncThunk(
  'user/editUser',
  async ({ staffId, userdetail }, { rejectWithValue }) => {
    try {
      const response = await edituser(staffId, userdetail)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userEditSlice = createSlice({
  name: 'userEdit',
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearEditState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearEditState } = userEditSlice.actions;

export default userEditSlice.reducer;
