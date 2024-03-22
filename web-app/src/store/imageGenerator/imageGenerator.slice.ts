import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiUtils, ComfyUIRequest } from "../../utils/network/api.utils";
import { RootState } from "../store";


interface SliceInterface {
    isLoading: boolean;
    outputImagebase64String: string|null;
    error: string | null;
}

const initialState: SliceInterface = {
    isLoading: false,
    outputImagebase64String: null,
    error: null
}

export const imageGeneratorAsyncActions = {
    generateImage: createAsyncThunk(
        'imageGenerator/generateImage',
        async (payload: ComfyUIRequest, { rejectWithValue }) => {
            try {
                const imageObj = await ApiUtils.generateImage(payload)
                return {imageObj};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
}

const imageGeneratorSlice = createSlice ({
    name: 'imageGenerator',
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(imageGeneratorAsyncActions.generateImage.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(imageGeneratorAsyncActions.generateImage.fulfilled, (state, {payload}) => {
            state.isLoading = false;
            state.error = null
            state.outputImagebase64String = payload.imageObj.image
        })
        .addCase(imageGeneratorAsyncActions.generateImage.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload as string
            console.error(payload);
        })
    },
    reducers: {}
})

export const imageGeneratorReducer = imageGeneratorSlice.reducer
export const imageGeneratorSelector = {
    selectAll: (state: RootState) => {
        return state.imageGenerator
    }
}
