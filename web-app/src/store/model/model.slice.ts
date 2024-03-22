import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ApiUtils, CompactModel, Model } from "../../utils/network/api.utils"
import { RootState } from "../store"

interface SliceInterface {
    isLoading: boolean,
    model: Model| null,
    error: string | null,
    allModels: CompactModel[],
}

const initialState: SliceInterface =  {
    isLoading: false,
    model: null,
    error: null,
    allModels: [],
}

export const modelAsyncActions = {
    addModel: createAsyncThunk(
        'model/addModel',
        async (payload:{userName: string, faceImage: string}, { rejectWithValue }) => {
            try {
                const modelData = await ApiUtils.addModel(payload.userName, payload.faceImage)
                return {modelData};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    getModel: createAsyncThunk(
        'model/getModel',
        async (payload:{}, { rejectWithValue }) => {
            try {
                const modelData = await ApiUtils.getModelData()
                return {modelData};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    getLiveModels: createAsyncThunk(
        'model/getLiveModels',
        async (payload:{}, { rejectWithValue }) => {
            try {
                const allModels = await ApiUtils.getLiveModels()
                return {allModels};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    deleteUserModels: createAsyncThunk(
        'model/deleteUserModels',
        async (payload:{}, { rejectWithValue }) => {
            try {
                const modelData = await ApiUtils.deleteUserModels()
                return {modelData};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    updateGoLive: createAsyncThunk(
        'model/updateGoLive',
        async (isLive:boolean, { rejectWithValue }) => {
            try {
                const modelData = await ApiUtils.updateGoLive(isLive)
                return {modelData};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    )


}

const modelSlice = createSlice ({
    name: "model",
    initialState,
    extraReducers: (builder) => {
        builder
        .addCase(modelAsyncActions.addModel.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(modelAsyncActions.addModel.fulfilled, (state, {payload}) => {
            state.model = payload.modelData
            state.isLoading = false;
            state.error = null;
        })
        .addCase(modelAsyncActions.addModel.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload as string;
            console.error(payload);
        })

        .addCase(modelAsyncActions.getModel.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(modelAsyncActions.getModel.fulfilled, (state, {payload}) => {
            state.model = payload.modelData
            state.isLoading = false;
            state.error = null;
        })
        .addCase(modelAsyncActions.getModel.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload as string;
            console.error(payload);
        })

        .addCase(modelAsyncActions.getLiveModels.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(modelAsyncActions.getLiveModels.fulfilled, (state, {payload}) => {
            state.allModels = payload.allModels
            state.isLoading = false;
            state.error = null;
        })
        .addCase(modelAsyncActions.getLiveModels.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload as string;
            console.error(payload);
        })

    
        .addCase(modelAsyncActions.deleteUserModels.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(modelAsyncActions.deleteUserModels.fulfilled, (state, {payload}) => {
            state.model = null
            state.isLoading = false;
            state.error = null;
        })
        .addCase(modelAsyncActions.deleteUserModels.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload as string;
            console.error(payload);
        })

        .addCase(modelAsyncActions.updateGoLive.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(modelAsyncActions.updateGoLive.fulfilled, (state, {payload}) => {
            state.model = null
            state.isLoading = false;
            state.error = null;
        })
        .addCase(modelAsyncActions.updateGoLive.rejected, (state, {payload}) => {
            state.isLoading = false;
            state.error = payload as string;
            console.error(payload);
        })
    },
    reducers: {}
})

export const modelReducer = modelSlice.reducer
export const modelSelector = {
    selectAll: (state: RootState) => {
        return state.model
    },
    selectAllModels: (state: RootState) => {
        return state.model.allModels
    }
}