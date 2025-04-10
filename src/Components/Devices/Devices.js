import React, { useEffect, useState } from "react";
import "../DeviceList/deviceList.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../../Redux/Slices/deviceSlice";
import DevicePopup from "../Devices/DevicePopup";
import "./Devices.css"

const Devices = () => {
  const dispatch = useDispatch();
  const { data: devices } = useSelector((state) => state.API);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); 

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const formatCreatedTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").split(".")[0];
  };

  const getAttribute = (info, key) => {
    if (!Array.isArray(info)) return "";
    const attr = info.find((item) => item.key === key);
    return attr ? attr.value : "";
  };

  const transformedDevices = (devices || []).map((device) => ({
    id: device.id.id,
    name: device.name,
    createdTime: formatCreatedTime(getAttribute(device.additionalInfo, "createdTime")),
    profile: device.type,
    label: device.label || "",
    state: getAttribute(device.additionalInfo, "active") ? "Active" : "Inactive",
    gateway: device.additionalInfo?.gateway || false,
  }));

  const filteredDevices = transformedDevices
    .filter((device) => device.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    console.log(filteredDevices);
    

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="table-container">
      <div className="sticky-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      </div>
      <table>
        <thead className="tele-header">
          <tr>
            <th onClick={() => handleSort("createdTime")}>Created Time</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("profile")}>Profile</th>
            <th>Label</th>
            <th onClick={() => handleSort("state")}>State</th>
            <th>Is Gateway</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device, index) => (
              <tr key={index} onClick={() => setSelectedDeviceId(device.id)} className="device-table">
                <td>{device.createdTime}</td>
                <td>{device.name}</td>
                <td>{device.profile}</td>
                <td>{device.label}</td>
                <td>
                  <span
                    className={`state-badge ${
                      device.state === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {device.state}
                  </span>
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
              <td colSpan="6">No devices available...</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedDeviceId && (
        <DevicePopup
          deviceId={selectedDeviceId}
          onClose={() => setSelectedDeviceId(null)}
        />
      )}
    </div>
  );
};

export default Devices;
