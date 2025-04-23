import React, { createContext, useContext, useState, useEffect } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => sessionStorage.getItem("selectedDeviceId") || null);
  const [selectedDeviceName, setSelectedDeviceName] = useState(() => sessionStorage.getItem("selectedDeviceName") || "");

  useEffect(() => {
    if (selectedDeviceId) {
      sessionStorage.setItem("selectedDeviceId", selectedDeviceId);
    } else {
      sessionStorage.removeItem("selectedDeviceId");
    }

    if (selectedDeviceName) {
      sessionStorage.setItem("selectedDeviceName", selectedDeviceName);
    } else {
      sessionStorage.removeItem("selectedDeviceName");
    }
  }, [selectedDeviceId, selectedDeviceName]);

  return (
    <DeviceContext.Provider value={{ selectedDeviceId, setSelectedDeviceId, selectedDeviceName, setSelectedDeviceName }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
