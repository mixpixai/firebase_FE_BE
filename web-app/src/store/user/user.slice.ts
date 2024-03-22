import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { ApiUtils, AppUser, CompactModel, GetUserResponse } from "../../utils/network/api.utils";
import { signOutUser, signInWithToken } from "../../utils/firebase/firebase.utils";

enum TosState {
    Unknown = "unknown",
    TosAccepted = "tosAccepted",
    TosRejected = "tosRejeceted",
}
interface SliceState  {
    appUser: AppUser | null,
    model: GetUserResponse['model'] | null;
    isLoading: boolean,
    errorString: string| null,
    tosStatus: TosState
}

const initialState: SliceState = {
    appUser: null,
    model: null,
    isLoading: false,
    errorString: null,
    tosStatus: TosState.Unknown
}

//aysnc Thunks
export const asyncUserActions = { 
    fetchUserData: createAsyncThunk(
        'user/fetchUserData',
        async (payload: {isLoggedIn: boolean , instaUserName: string}, { rejectWithValue }) => {
            if (!payload.isLoggedIn) {
                // Explicitly return null for the fulfillment value when not logged in
                // Note: Thunks resolve with a fulfilled action even when returning null
                return rejectWithValue('Not logged in');
            }
            try {
                const response = await ApiUtils.getAppUser(payload.instaUserName);
                return response;
            } catch (error) {
                // Assuming error is of type Error, cast and return its message
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    loginAsTestUser: createAsyncThunk(
        'user/loginAsTestUser',
        async (password:string, {rejectWithValue} ) => {
            try {
                const token =  await ApiUtils.generateTestLoginToken({password});
                await signInWithToken(token)    
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    updateTOS: createAsyncThunk(
        'user/updateTOS',
        async (acceptTOS: boolean, { rejectWithValue }) => {
            try {
                const appUser = await ApiUtils.updateTOSStatus(acceptTOS)
                return {appUser};
            } catch (error) {
                return rejectWithValue((error as Error).message);
            }
        }
    ),
    logout: createAsyncThunk(
        'user/logout',
        async () => {
            await signOutUser()
            return {};
        }
    )
}

const slice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(asyncUserActions.fetchUserData.pending, (state) => {
                state.isLoading = true;
                state.errorString = null;
            })
            .addCase(asyncUserActions.fetchUserData.fulfilled, (state, {payload}) => {
                // Action.payload will have the data returned by fetchUserData
                state.appUser = payload.user;
                state.model = payload.model;
                state.isLoading = false;
                state.errorString = null;
            })
            .addCase(asyncUserActions.fetchUserData.rejected, (state, action) => {
                // Handle the error state
                console.error(action.payload); // action.payload should be the error message
                state.appUser = null;
                state.model = null;
                state.isLoading = false;
                state.errorString = action.payload as string;
            })

            .addCase(asyncUserActions.loginAsTestUser.pending, (state) => {
                state.isLoading = true;
                state.errorString = null;
            })
            .addCase(asyncUserActions.loginAsTestUser.fulfilled, (state) => {
                state.isLoading = false;
                state.errorString = null;
            })
            .addCase(asyncUserActions.loginAsTestUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errorString = action.payload as string;
            })


            .addCase(asyncUserActions.updateTOS.pending, (state) => {
                state.isLoading = false;
                state.errorString = null;
            })
            .addCase(asyncUserActions.updateTOS.fulfilled, (state, {payload}: PayloadAction<{appUser: AppUser}>) => {
                // Action.payload will have the data returned by fetchUserData
                state.appUser = payload.appUser;
                state.isLoading = false;
                state.errorString = null;
            })
            .addCase(asyncUserActions.updateTOS.rejected, (state, action) => {
                // Handle the error state
                console.error(action.payload); // action.payload should be the error message
                state.appUser = null;
                state.isLoading = false;
                state.errorString = action.payload as string;
            });
    },
    reducers: {
        updateModel: (state, action: PayloadAction<CompactModel>) => {
            state.model = action.payload
        },
    }
})

export const userActions = slice.actions
export const userReducer = slice.reducer
export const userSelector = {
    selectUser: (state: RootState) => {
        return state.user.appUser
    },
    selectModel: (state: RootState) => {
        return state.user.model
    },
    selectTOSStatus : (state: RootState) => {
        return state.user.tosStatus
    },
    selectFullUser : (state: RootState) => {
        return state.user
    }
}

