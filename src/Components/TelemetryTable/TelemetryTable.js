import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTelemetryData } from "../../Redux/Slices/telemetrySlice";
import "./TelemetryTable.css";
import { TelemetryWebSocket } from "../Web Socket/TelemetryWebSocket";
import { useParams } from "react-router-dom";

const TelemetryTable = () => {
  const dispatch = useDispatch();
  const { jsonData, lastUpdateTs } = useSelector((state) => state.telemetry);
  const {  telemetryData } = TelemetryWebSocket()
  const { deviceId } = useParams()

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  

  useEffect(() => {
    if (deviceId) {
      dispatch(fetchTelemetryData(deviceId));
    }

  }, [deviceId, dispatch, telemetryData]);

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

  return (
    <div className="table-container">
      <h2>Telemetry</h2>
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
            <th onClick={() => handleSort("timestamp")}>Last update time{sortField === "timestamp" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
            <th onClick={() => handleSort("key")}>Key {sortField === "key" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map(([key, value], index) => (
              <tr key={index}>
                <td>{new Date(lastUpdateTs).toLocaleString()}</td>
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


