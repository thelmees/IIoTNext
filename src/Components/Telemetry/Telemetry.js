import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Telemetry.css";
import { Toast } from "primereact/toast";
import { WebSocketContext } from "../Web Socket/webSocketContext";
import { useDispatch, useSelector } from "react-redux";
import { useDevice } from '../../DeviceContext'
import { downloadConfiguration, fetchConfigurationData, saveConfiguration, toggleField, updateField } from "../../Redux/Slices/configurationSlice";
import DownloadStatusBar from "../StatusBar/StatusBar";
import { DownloadWebSocketProvider } from "../Web Socket/DownloadStatusWebSocket";

const Telemetry = () => {
  const { deviceId } = useParams();
  const token = localStorage.getItem("token");
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { status, setDeviceId } = useContext(WebSocketContext)
  const { jsonData, loading, error } = useSelector((state) => state.configuration);
  const key = "telemetry_conf_1"

  useEffect(() => {
    if (deviceId) {
      setDeviceId(deviceId);
      dispatch(fetchConfigurationData({deviceId, key}))
    }
  }, [deviceId, key, setDeviceId, dispatch]);

  const handleChange = (e) => {
    dispatch(updateField({ name: e.target.name, value: e.target.value }))
  };

  const handleToggleChange = (name) => {
    dispatch(toggleField(name))
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await dispatch(saveConfiguration({ deviceId, jsonData,  key }));
    toast.current.show({ severity: "success", summary: "Success", detail: "Configuration Saved", life: 2000 });
  }

  const handleDownload = async (e) => {
    e.preventDefault();
    await dispatch(downloadConfiguration(deviceId))
    toast.current.show({ severity: "success", summary: "Success", detail: "Download Successful", life: 2000 });
  };

  return (
    <div className="telemetry-table">
      <Toast ref={toast} />
        <div className="status-container">
          <div>
          <button className={`status-button ${!status ? "offline" : ""}`}>
            {status ? "ONLINE" : "OFFLINE"}
          </button>
          </div>
          <div>
          <DownloadWebSocketProvider>
            <DownloadStatusBar deviceId={deviceId}/>
          </DownloadWebSocketProvider>
          </div>
        </div>
      <div className="json-editor">
        <div className="json-header">
          <h2>Telemetry Configuration for Device</h2>
        </div>
        <form>
          {Object.keys(jsonData).map((key) => (
            <div className="form-group" key={key}>
              <label>{key}:</label>
              {["mqtt2", "onchange_send", "mqtt_is_secure"].includes(key) ? (
                <label className="switch">
                  <input type="checkbox" checked={jsonData[key] === 1} onChange={() => handleToggleChange(key)} />
                  <span className="slider"></span>
                </label>
              ) : (
                <input type="text" name={key} value={jsonData[key]} onChange={handleChange} className="input-field" />
              )}
            </div>
          ))}
          <div className="telemetry-buttons">
            <button onClick={handleSave} className="save-button">
              Save
            </button>
            <button onClick={handleDownload} className="save-button">
              Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Telemetry;
