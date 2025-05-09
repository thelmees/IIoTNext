import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => sessionStorage.getItem("selectedDeviceId") || null);
  const [selectedDeviceName, setSelectedDeviceName] = useState(() => sessionStorage.getItem("selectedDeviceName") || "");

  const location = useLocation();

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

  useEffect(() => {
    if (location.pathname === "/deviceList") {
      setSelectedDeviceId(null);
      setSelectedDeviceName("");
      setSelectedComponent("")
    }
  }, [location.pathname]);

  return (
    <DeviceContext.Provider value={{
      selectedDeviceId, setSelectedDeviceId,
      selectedDeviceName, setSelectedDeviceName,
      selectedComponent, setSelectedComponent
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
