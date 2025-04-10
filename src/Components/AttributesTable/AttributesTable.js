// AttributesTable.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAttributes } from "../../Redux/Slices/attributesSlice";
import "../TelemetryTable/TelemetryTable.css";
import "./AttributesTable.css"

const AttributesTable = ({ deviceId }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { data: devices } = useSelector((state) => state.API);

  const [scope, setScope] = useState("CLIENT_SCOPE");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("lastUpdateTs");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data: attributes, status, error } = useSelector((state) => state.attributes);

  useEffect(() => {
    if (deviceId) {
      dispatch(fetchAttributes({ deviceId, scope, token }));
    }
  }, [deviceId, scope, dispatch, token]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const filteredAttributes = attributes
    .filter((attr) =>
      attr.key.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  const selectedDevice = devices.find(device => device.id.id === deviceId);

  return (
    <div className="table-container Attributes-container">

      {selectedDevice && (
        <h2>{selectedDevice.name}</h2>
      )}
      <div className="sticky-controls">
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="search-input"
        >
          <option value="CLIENT_SCOPE">Client attribute</option>
          <option value="SERVER_SCOPE">Server attribute</option>
          <option value="SHARED_SCOPE">Shared attribute</option>
        </select>

        <input
          className="search-input"
          type="text"
          placeholder="Search key"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="attributs-table">
        <thead className="sticky-header">
          <tr>
            <th onClick={() => handleSort("lastUpdateTs")}>
              Last Update Time {sortField === "lastUpdateTs" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("key")}>
              Key {sortField === "key" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {status === "loading" ? (
            <tr><td colSpan="3">Loading...</td></tr>
          ) : filteredAttributes.length > 0 ? (
            filteredAttributes.map((attr, index) => (
              <tr key={index}>
                <td>{new Date(attr.lastUpdateTs).toLocaleString()}</td>
                <td className="copyable-cell">
                  <span>{attr.key}</span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(attr.key)}
                  >
                    <box-icon name='copy' size="xs" ></box-icon>
                  </button>
                </td>
                <td className="copyable-cell">
                  <span className="ellipsis-text">
                    {typeof attr.value === "object"
                      ? JSON.stringify(attr.value)
                      : String(attr.value)}
                  </span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(
                      typeof attr.value === "object"
                        ? JSON.stringify(attr.value)
                        : String(attr.value)
                    )}
                  >
                    <box-icon name='copy' size="xs" ></box-icon>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No attribute data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttributesTable;