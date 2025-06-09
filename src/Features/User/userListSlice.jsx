import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userkApi from "../../Services/api/UserApi";

export const fetchUserData = createAsyncThunk(
    "fetchUserData",
    async () => {
        try {
            const response = await userkApi.getUserListApi();
            return response;
        } catch (error) {
            console.error("Failed to fetch customer data", error);
            throw error;
        }
    } 
);

const userListSlice = createSlice({
    name: 'user',
    initialState: { 
        userData: [],
        isLoading: false,
        isError: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state, action) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.isError = true;
                state.isLoading = false;
            });
    },
});

export default userListSlice.reducer;


