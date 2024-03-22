import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user/user.slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { deviceTypeReducer } from "./deviceType/deviceType.slice";
import { imageGeneratorReducer } from "./imageGenerator/imageGenerator.slice";
import { modelReducer } from "./model/model.slice";
import { adminReducer } from "./admin/admin.slice";

const reducers = {
    user: userReducer,
    deviceType : deviceTypeReducer,
    imageGenerator: imageGeneratorReducer,
    model: modelReducer,
    admin: adminReducer,
};
  
console.log(reducers); // Check if the structure is as expected
  
export const store = configureStore({
    reducer: reducers,
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector