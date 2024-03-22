import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ApiUtils, Model, VerificationObject } from "../../utils/network/api.utils"
import { RootState } from "../store"

interface SliceInterface {
    isLoading: boolean
    userData: Model| null
    error: string| null
}

const initialState: SliceInterface = {
    isLoading: false,
    userData: null,
    error: null
}

export const adminAsyncAction = {
    getModelUserAsAdmin: createAsyncThunk(
        'admin/getModelUserAsAdmin',
        async (payload: {compositeCode:string, userName: string}, { rejectWithValue }) => {
            try {
                const modelData = await ApiUtils.getModelUserAsAdmin(payload)
                return {modelData};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    verifyUser: createAsyncThunk(
        'admin/verifyUser',
        async (payload: {modelUid:string, verificationObject: VerificationObject}, { rejectWithValue }) => {
            try {
                const modelData = await ApiUtils.verifyUser(payload)
                return {modelData};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  extraReducers: (builder) => {
    builder
    .addCase(adminAsyncAction.getModelUserAsAdmin.pending, (state) => {
        state.isLoading = true
        state.error = ""
    })
    .addCase(adminAsyncAction.getModelUserAsAdmin.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.userData = payload.modelData
        state.error = ""
    })
    .addCase(adminAsyncAction.getModelUserAsAdmin.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload as string
    })

    .addCase(adminAsyncAction.verifyUser.pending, (state) => {
        state.isLoading = true
        state.error = ""
    })
    .addCase(adminAsyncAction.verifyUser.fulfilled, (state, {payload}) => {
        state.isLoading = false
        state.userData = payload.modelData
        state.error = ""
    })
    .addCase(adminAsyncAction.verifyUser.rejected, (state, {payload}) => {
        state.isLoading = false
        state.error = payload as string
    })

  },
  reducers: {}
})

export const adminReducer = adminSlice.reducer
export const adminSelector = {
    selectAll: (state: RootState) => {
        return state.admin
    }
}