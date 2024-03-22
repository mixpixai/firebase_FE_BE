import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";


interface SliceState {
    isMobile: boolean
}

const isMobileDeviceUserAgent = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const initialState: SliceState = {
    isMobile: isMobileDeviceUserAgent()
}

const slice = createSlice ({
    name: "deviceType",
    initialState,
    reducers: {
        updateDeviceWidth: (state, {payload}: PayloadAction<{width: number}> ) => {
            state.isMobile = payload.width < 768 || isMobileDeviceUserAgent()
        }
    }
})

export const deviceTypeReducer = slice.reducer
export const deviceTypeActions = slice.actions
export const deviceTypeSelectors = {
    selectIsMobile: (state: RootState) => {
        return state.deviceType.isMobile
    }
}