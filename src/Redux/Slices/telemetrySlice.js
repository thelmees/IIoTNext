import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, defaultAttributes } from "../../config"; 

export const fetchTelemetryData = createAsyncThunk(
  "telemetry/fetchTelemetryData",
  async (deviceId, { rejectWithValue }) => {

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("selectedDeviceId");
      window.location.href = "/";
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/plugins/telemetry/DEVICE/${deviceId}/values/attributes?keys=telemetry_conf_1`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let apiData = response.data.length > 0 ? response.data[0] : {};
return {
  lastUpdateTs: apiData.lastUpdateTs,
  value: {  ...defaultAttributes,...apiData.value }
};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveTelemetryData = createAsyncThunk(
  "telemetry/saveTelemetryData",
  async ({ deviceId, jsonData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { telemetry_conf_1: jsonData };

      await axios.post(`${API_BASE_URL}/plugins/telemetry/${deviceId}/SERVER_SCOPE`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return jsonData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadTelemetry = createAsyncThunk(
  "telemetry/downloadTelemetry",
  async (deviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/rpc/oneway/${deviceId}`,
        { method: "download", params: "{}" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return "Download successful";
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const telemetrySlice = createSlice({
  name: "telemetry",
  initialState: {
    jsonData: {},
    lastUpdateTs: null,
    loading: false,
    error: null,
    downloadMessage: null,
  },
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state.jsonData[name] = value;
    },
    toggleField: (state, action) => {
      const name = action.payload;
      state.jsonData[name] = state.jsonData[name] === 1 ? 0 : 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTelemetryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTelemetryData.fulfilled, (state, action) => {
        state.loading = false;
        state.jsonData = action.payload.value;
        state.lastUpdateTs = action.payload.lastUpdateTs;
      })
      .addCase(fetchTelemetryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveTelemetryData.fulfilled, (state, action) => {
        state.jsonData = action.payload;
      })
      .addCase(downloadTelemetry.fulfilled, (state, action) => {
        state.downloadMessage = action.payload;
      });
  },
});

export const { updateField, toggleField } = telemetrySlice.actions;
export default telemetrySlice.reducer;

