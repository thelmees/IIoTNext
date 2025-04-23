import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAttributes } from "../../Redux/Slices/attributesSlice";
import "../TelemetryTable/TelemetryTable.css";
import "./AttributesTable.css";
import { useAttributesWebSocket } from "../Web Socket/AttributesWebSocket";
import { useParams } from "react-router-dom";

const AttributesTable = () => {
  const dispatch = useDispatch();
  const { attr: attribute, status, error } = useSelector((state) => state.attributes);
  const { attributesData } = useAttributesWebSocket();
  const [scope, setScope] = useState("CLIENT_SCOPE");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const { deviceId } = useParams()


  useEffect(() => {
    if (deviceId && scope) {
      dispatch(fetchAttributes({ deviceId, scope }));
    }

  }, [deviceId, dispatch, scope, attributesData]);

  useEffect(() => {
    // console.log("Attributes state updated:", { attributes, status, error});
  }, [attribute, status, error]);

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

  const filteredAttributes = (attribute || [])
    .filter((attr) => attr?.key?.toLowerCase().includes(search.toLowerCase()))
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


  return (
    <div className="table-container Attributes-container">
      <h2>Attributes</h2>

      {error && (
        <div style={{ color: "red" }}>
          Error: {error.message || JSON.stringify(error)}
        </div>
      )}

      <div className="sticky-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search keys"
          value={search}
          onChange={(e) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
        <div className="scope-tabs">
          {["CLIENT_SCOPE", "SERVER_SCOPE", "SHARED_SCOPE"].map((s) => (
            <button
              key={s}
              className={`scope-tab ${scope === s ? "activee" : ""}`}
              onClick={() => setScope(s)}
            >
              {s === "CLIENT_SCOPE"
                ? "Client"
                : s === "SERVER_SCOPE"
                  ? "Server"
                  : "Shared"}
            </button>
          ))}
        </div>

      </div>

      <table className="attributs-table">
        <thead className="sticky-header">
          <tr>
            <th onClick={() => handleSort("lastUpdateTs")}>
              Last update time{" "}
              {sortField === "lastUpdateTs" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => handleSort("key")}>
              Key {sortField === "key" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          { filteredAttributes.length > 0 ? (
            filteredAttributes.map((attr, index) => (
              <tr key={index}>
                <td>{new Date(attr.lastUpdateTs).toLocaleString()}</td>
                <td className="copyable-cell">
                  <span>{attr.key}</span>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(attr.key)}
                  >
                    <box-icon name="copy" size="xs"></box-icon>
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
                    onClick={() =>
                      copyToClipboard(
                        typeof attr.value === "object"
                          ? JSON.stringify(attr.value)
                          : String(attr.value)
                      )
                    }
                  >
                    <box-icon name="copy" size="xs"></box-icon>
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