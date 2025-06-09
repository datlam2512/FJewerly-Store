import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../Services/axios/config';


export const uploadImage = createAsyncThunk('imageUpload/uploadImage', async ({ file, itemId }, thunkAPI) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('itemId', itemId);
    
    try {
        const response = await axios.post(`/api/ItemImage/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const imageUploadSlice = createSlice({
    name: 'imageUpload',
    initialState: {
        loading: false,
        success: false,
        error: null,
        imageUrl: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.imageUrl = action.payload.imageUrl;
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export default imageUploadSlice.reducer;
