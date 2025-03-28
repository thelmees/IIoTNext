import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {API_BASE_URL, params} from '../../config'
import axios from "axios";

export const fetchDevices = createAsyncThunk('devices/fetchDevices', async (_, { rejectWithValue }) => {
  
  const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return rejectWithValue("Unauthorized");
    }

    try {

        const response = await axios.get(`${API_BASE_URL}/user/devices?pageSize=30&page=0`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        const deviceList = response.data.data
        const updatedDevice = await Promise.all(
            deviceList.map(async (device) => {
                try {
                    const detailsResponse = await axios.get(`${API_BASE_URL}/plugins/telemetry/DEVICE/${device.id.id}/values/attributes`, {
                      params: { keys:params},
                      headers: { Authorization: `Bearer ${token}` },
                    });

                    const activeStatus = detailsResponse.data.find((item) => item.key === "active")?.value || false;

                    return { ...device, additionalInfo: detailsResponse.data, isActive:activeStatus };
                  } catch (error) {
                    console.error("Error fetching device details:", error);
                    window.location.href = "/";
                    return { ...device, additionalInfo: null };
                  }
                })
              );
          
              return updatedDevice;
            } catch (error) {
              console.error("API error:", error.response ? error.response.data : error.message);
              window.location.href = "/";
              return rejectWithValue(error.message);
            }
})

const APISlice = createSlice({
    name: "API",
    initialState:{data:[], loading : false, error:null,token:null},
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchDevices.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchDevices.fulfilled,(state,action)=>{
            state.loading = false;
            state.data = action.payload
        })

        .addCase(fetchDevices.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default APISlice.reducer