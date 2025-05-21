import React, { useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import "../Telemetry/Telemetry.css";
import { Toast } from "primereact/toast";
import { WebSocketContext } from "../Web Socket/webSocketContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchConfigurationData, updateField, toggleField } from "../../Redux/Slices/configurationSlice";
import { downloadConfiguration } from "../../Redux/Slices/configurationSlice";
import { saveConfiguration } from "../../Redux/Slices/configurationSlice";
import { LogToggleFields} from "../../config";
import { DownloadWebSocketProvider } from "../Web Socket/DownloadStatusWebSocket";
import DownloadStatusBar from "../StatusBar/StatusBar";

const LogConfiguration = () => {
  const { deviceId } = useParams();
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { status, setDeviceId } = useContext(WebSocketContext);
  const { jsonData, error } = useSelector((state) => state.configuration);
  const key = "logconfig_conf_1"

    useEffect(() => {
  if (error) {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: typeof error === 'string' ? error : "Something went wrong",
      life: 3000,
    });
  }
}, [error]);

  useEffect(() => {
    if (deviceId) {
      setDeviceId(deviceId);
      dispatch(fetchConfigurationData({ deviceId, key }))
    }
  }, [deviceId, setDeviceId, dispatch]);

  const handleChange = (e) => {
    dispatch(updateField({ name: e.target.name, value: e.target.value }));
  };

  const handleToggleChange = (name) => {
    dispatch(toggleField(name));
  };

  const handleSave = async (e) => {
    e.preventDefault();
 try {
    await dispatch(saveConfiguration({ deviceId, jsonData, key }));
    toast.current.show({ severity: "success", summary: "Success", detail: "Configuration Saved", life: 2000 });
  } catch (err) {
    toast.current.show({ severity: "error", summary: "Save Failed", detail: err?.message || "Something went wrong", life: 3000 });
  }
  }

  const handleDownload = async (e) => {
    e.preventDefault();
try {
    await dispatch(downloadConfiguration(deviceId));
    toast.current.show({ severity: "success", summary: "Success", detail: "Download Successful", life: 2000 });
  } catch (err) {
    toast.current.show({ severity: "error", summary: "Download Failed", detail: err || "Something went wrong", life: 3000 });
  }
  };
  return (
    <div className="telemetry-table">
      <Toast ref={toast} position="bottom-right"/>
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
          <h2>Log Configuration</h2>
        </div>


        <form>
          {Object.entries(jsonData).map(([key, value]) => {
            const isToggle = LogToggleFields.includes(key);

            return (
              <div className="form-group" key={key}>
                <label>{key}:</label>
                {isToggle ? (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={value === 1}
                      onChange={() => handleToggleChange(key)}
                    />
                    <span className="slider"></span>
                  </label>
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="input-field"
                  />
                )}
              </div>
            );
          })}
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

export default LogConfiguration;