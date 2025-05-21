import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, defaultAttributesMap, defaultBasicAttributes, defaultTelemetryAttributes } from "../../config";

export const fetchConfigurationData = createAsyncThunk(
  "configuration/fetchTelemetryData",
  async ({ deviceId, key }, { rejectWithValue }) => {

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem("token");
      window.location.href = "/";
      sessionStorage.removeItem("selectedDeviceId");
      return rejectWithValue("Unauthorized");
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/plugins/telemetry/DEVICE/${deviceId}/values/attributes?keys=${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let apiData = response.data.length > 0 ? response.data[0] : {};
      const defaults = defaultAttributesMap[key] || {};

      return {
        lastUpdateTs: apiData.lastUpdateTs,
        value: { ...defaults, ...apiData.value }
      };
    } catch (error) {
      window.location.href = "/";
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveConfiguration = createAsyncThunk(
  "configuration/saveTelemetryData",
  async ({ deviceId, jsonData, key }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const payload = { [key]: jsonData };

      await axios.post(`${API_BASE_URL}/plugins/telemetry/${deviceId}/SERVER_SCOPE`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return jsonData;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadConfiguration = createAsyncThunk(
  "configuration/downloadTelemetry",
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
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const telemetrySlice = createSlice({
  name: "configuration",
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
      state.jsonData[name] = value === "" ? "" : isNaN(Number(value)) ? value : Number(value);
    },
    toggleField: (state, action) => {
      const name = action.payload;
      state.jsonData[name] = state.jsonData[name] === 1 ? 0 : 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigurationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfigurationData.fulfilled, (state, action) => {
        state.loading = false;
        state.jsonData = action.payload.value;
        state.lastUpdateTs = action.payload.lastUpdateTs;
      })
      .addCase(fetchConfigurationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveConfiguration.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(downloadConfiguration.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(saveConfiguration.fulfilled, (state, action) => {
        state.jsonData = action.payload;
      })
      .addCase(downloadConfiguration.fulfilled, (state, action) => {
        state.downloadMessage = action.payload;
      });
  },
});

export const { updateField, toggleField } = telemetrySlice.actions;
export default telemetrySlice.reducer;

