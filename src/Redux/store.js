import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import APIReducer from "./Slices/deviceSlice"
import telemetryReducer from './Slices/telemetrySlice'
import attributesReducer from './Slices/attributesSlice'


export const store = configureStore({
    reducer:{
        auth:authReducer,
        API:APIReducer,
        telemetry:telemetryReducer,
        attributes: attributesReducer,
    }
})