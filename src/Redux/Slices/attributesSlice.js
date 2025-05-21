import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchAttributes = createAsyncThunk( "attributes/fetchAttributes", 
    async ({ deviceId, scope},{ rejectWithValue }) => {

      const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem("token");
      window.location.href = "/";
      sessionStorage.removeItem("selectedDeviceId");
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/plugins/telemetry/DEVICE/${deviceId}/values/attributes/${scope}`,{
          headers: {Authorization: `Bearer ${token}`},
        });
      return response.data || [];
    } catch (error) {
      window.location.href = "/";
      return rejectWithValue("Failed to fetch attributes");
    }
  }
);

const attributesSlice = createSlice({
  name: "attributes",
  initialState: {
    attr: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearAttributes: (state) => {
      state.attr = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.attr = action.payload;
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAttributes } = attributesSlice.actions;

export default attributesSlice.reducer;
