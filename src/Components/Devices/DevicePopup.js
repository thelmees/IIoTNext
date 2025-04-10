import React, { useState } from "react";
import TelemetryTable from "../TelemetryTable/TelemetryTable";
import AttributesTable from "../AttributesTable/AttributesTable";
import "./DevicePopup.css";

const DevicePopup = ({ deviceId, onClose }) => {
  const [activeTab, setActiveTab] = useState("telemetry");

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="tab-buttons">
          <button
            className={activeTab === "telemetry" ? "active" : ""}
            onClick={() => setActiveTab("telemetry")}
          >
            
            Latest telemetry
          </button>
          <button
            className={activeTab === "attributes" ? "active" : ""}
            onClick={() => setActiveTab("attributes")}
          >
            Attributes
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "telemetry" ? (
            <TelemetryTable deviceId={deviceId} />
          ) : (
            <AttributesTable deviceId={deviceId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DevicePopup;
