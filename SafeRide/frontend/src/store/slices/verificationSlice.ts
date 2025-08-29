import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VerificationDocument } from '../../types/verification';
import { uploadDocument, fetchVerificationStatus } from '../../api/verificationApi';

interface VerificationState {
    documents: VerificationDocument[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: VerificationState = {
    documents: [],
    status: 'idle',
    error: null,
};

export const uploadVerificationDocument = createAsyncThunk(
    'verification/uploadDocument',
    async (document: File) => {
        const response = await uploadDocument(document);
        return response.data;
    }
);

export const fetchVerificationStatusAsync = createAsyncThunk(
    'verification/fetchStatus',
    async () => {
        const response = await fetchVerificationStatus();
        return response.data;
    }
);

const verificationSlice = createSlice({
    name: 'verification',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadVerificationDocument.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadVerificationDocument.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.documents.push(action.payload);
            })
            .addCase(uploadVerificationDocument.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to upload document';
            })
            .addCase(fetchVerificationStatusAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVerificationStatusAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.documents = action.payload;
            })
            .addCase(fetchVerificationStatusAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch verification status';
            });
    },
});

export const { clearError } = verificationSlice.actions;

export default verificationSlice.reducer;