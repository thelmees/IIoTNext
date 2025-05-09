import React, { createContext, useState, useEffect, useRef } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [status, setStatus] = useState(false);
  const [deviceId,setDeviceId] = useState(null)
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
            scope: "SERVER_SCOPE",
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
        // console.log("WebSocket Message:", receivedData);

        if (receivedData.data?.active?.length > 0) {
          const statusValue = receivedData?.data?.active[0][1];
          setStatus(statusValue === 'true');
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
  }, [token,deviceId]);

  return (
    <WebSocketContext.Provider value={{ status,setDeviceId }}>
      {children}
    </WebSocketContext.Provider>
  );
};
