import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export const useWebSocket = () => {
  const [status, setStatus] = useState({});
  const [shouldReconnect, setShouldReconnect] = useState(false);
  const webSocketRef = useRef(null);
  const token = localStorage.getItem("token");
  const { data: devices = [] } = useSelector((state) => state.API);
  const deviceIds = devices.map((device) => device.id.id);

  useEffect(() => {
    if (!token || deviceIds.length === 0) return;

    if (webSocketRef.current) {
      return;
    }

    const ws = new WebSocket("wss://app.iiotnext.com:443/api/ws"); 
    webSocketRef.current = ws;

    ws.onopen = () => {

      const message = {
        authCmd: { cmdId: 0, token: token }, 
        cmds: deviceIds.map((id, index) => ({
          entityType: "DEVICE",
          entityId: id,
          scope: "SERVER_SCOPE",
          cmdId: index + 10, 
          type: "ATTRIBUTES",
        })),
      };

      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);

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
    };
  }, [token,devices]);

  return { status };
};



