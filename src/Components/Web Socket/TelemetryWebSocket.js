import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";

export const TelemetryWebSocket = () => {
  const [telemetryData, setTelemetryData] = useState({});
  const webSocketRef = useRef(null);
  const token = localStorage.getItem("token");
  const { data: devices = [] } = useSelector((state) => state.API);

  const deviceIds = useMemo(() => {
    return devices.map((d) => d?.id?.id).filter(Boolean);
  }, [devices]);

  useEffect(() => {
    if (!token || deviceIds.length === 0 || webSocketRef.current) return;

    const ws = new WebSocket("wss://app.iiotnext.com:443/api/ws");
    webSocketRef.current = ws;

    ws.onopen = () => {

      const message = {
        authCmd: { cmdId: 0, token },
        cmds: deviceIds.map((id, index) => ({
          entityType: "DEVICE",
          entityId: id,
          scope: "SERVER_SCOPE",
          cmdId: index + 1, 
          type: "ATTRIBUTES",
        })),
      };

      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.data) {
          setTelemetryData((prev) => ({
            ...prev,
            ...receivedData.data,
          }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("Telemetry WebSocket Disconnected");
      webSocketRef.current = null;
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
        webSocketRef.current = null;
      }
    };
  }, [token, deviceIds]);

  return { telemetryData };
};
