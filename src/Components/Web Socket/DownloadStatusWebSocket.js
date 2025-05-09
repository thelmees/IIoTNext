import React, { createContext, useState, useEffect, useRef } from "react";

export const DownloadWebSocketContext = createContext(null);

export const DownloadWebSocketProvider = ({ children }) => {
  const [downloadPercent, setDownloadPercent] = useState(100);
  const [downloadState, setDownloadState] = useState("Completed");
  const [downloadWarning, setDownloadWarning] = useState("None");
  const [deviceId, setDeviceId] = useState(null);
  const webSocketRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !deviceId) return;

    const ws = new WebSocket("wss://app.iiotnext.com:443/api/ws");

    ws.onopen = () => {
      console.log("WebSocket Connected");

      const message = {
        authCmd: {
          cmdId: 0,
          token: token,
        },
        cmds: [
          {
            entityType: "DEVICE",
            entityId: deviceId,
            scope: "CLIENT_SCOPE",
            cmdId: 10,
            type: "ATTRIBUTES",
          },
        ],
      };

      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        const attributes = receivedData?.data || [];

        console.log("Full WebSocket Message:", receivedData?.data);

        if (attributes.info_download_percent !== undefined) {
            setDownloadPercent(Number(attributes.info_download_percent[0][1]));
          }
          if (attributes.info_state_dl !== undefined) {
            setDownloadState(attributes.info_state_dl[0][1]);
          }
          if (attributes.info_warning_dl !== undefined) {
            setDownloadWarning(attributes.info_warning_dl[0][1]);
          }
          
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    webSocketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [token, deviceId]);

  return (
    <DownloadWebSocketContext.Provider
      value={{ downloadPercent, downloadState, downloadWarning, setDeviceId,}}
    >
      {children}
    </DownloadWebSocketContext.Provider>
  );
};
