import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import APIReducer from "./Slices/deviceSlice"
import configurationReducer from './Slices/configurationSlice'
import attributesReducer from './Slices/attributesSlice'


export const store = configureStore({
    reducer:{
        auth:authReducer,
        API:APIReducer,
        configuration:configurationReducer,
        attributes: attributesReducer,
    }
})