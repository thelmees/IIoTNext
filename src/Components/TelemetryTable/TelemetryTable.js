import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTelemetryData } from "../../Redux/Slices/telemetrySlice";
import "./TelemetryTable.css";

const TelemetryTable = ({ deviceId }) => {
  const dispatch = useDispatch();
  const { jsonData } = useSelector((state) => state.telemetry);
  const { data: devices } = useSelector((state) => state.API);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (deviceId) {
      dispatch(fetchTelemetryData(deviceId));
    }

    const interval = setInterval(() => {
      if (deviceId) dispatch(fetchTelemetryData(deviceId));
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceId, dispatch]);

  const filteredData = Object.entries(jsonData || {})
    .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = sortField === "timestamp" ? new Date() : a[sortField === "key" ? 0 : 1];
      const valB = sortField === "timestamp" ? new Date() : b[sortField === "key" ? 0 : 1];
      return sortOrder === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
    };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const selectedDevice = devices.find(device => device.id.id === deviceId);

  return (
    <div className="table-container">
     {selectedDevice && (
        <h2>{selectedDevice.name}</h2>
      )}
      <div className="sticky-input">
      <input
        className="search-input"
        type="text"
        placeholder="Search keys"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      </div>
      <table>
        <thead className="tele-header">
          <tr>
            <th onClick={() => handleSort("timestamp")}>Last update time Key {sortField === "timestamp" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
            <th onClick={() => handleSort("key")}>Key {sortField === "key" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
            <th>Value</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map(([key, value], index) => (
              <tr key={index}>
                <td>{new Date().toLocaleString()}</td>
                <td className="copyable-cell">
                  <span>{key}</span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(key)}
                  >
                    <box-icon name='copy' size="xs" ></box-icon>
                  </button>
                </td>
                <td className="copyable-cell">
                  <span >
                    {value}
                  </span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(value)}
                  >
                    <box-icon name='copy' size="xs" ></box-icon>
                  </button>
                </td>
                <td>
                  <button className="delete-btn">
                    <i className="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No telemetry data available...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TelemetryTable;


