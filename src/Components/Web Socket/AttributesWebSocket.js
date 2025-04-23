import { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";

export const useAttributesWebSocket = () => {
  const [attributesData, setAttributesData] = useState({
    CLIENT_SCOPE: {},
    SERVER_SCOPE: {},
    SHARED_SCOPE: {},
  });

  const subscriptionIdToScope = {
    10: "CLIENT_SCOPE",
    11: "SERVER_SCOPE",
    12: "SHARED_SCOPE",
  };

  const webSocketRef = useRef(null);
  const token = localStorage.getItem("token");

  const { data: devices = [] } = useSelector((state) => state.API);
  const deviceIds = useMemo(() => devices.map((d) => d.id.id), [devices]);

  useEffect(() => {
    if (!token || deviceIds.length === 0) {
      return;
    }

    if (webSocketRef.current && webSocketRef.current.readyState !== WebSocket.CLOSED) {
      console.log("WebSocket already connected");
      return;
    }

    const ws = new WebSocket("wss://app.iiotnext.com:443/api/ws");
    webSocketRef.current = ws;

    ws.onopen = () => {

      const cmds = deviceIds.flatMap((id) => [
        {
          entityType: "DEVICE",
          entityId: id,
          scope: "CLIENT_SCOPE",
          cmdId: 10,
          type: "ATTRIBUTES",
        },
        {
          entityType: "DEVICE",
          entityId: id,
          scope: "SERVER_SCOPE",
          cmdId: 11,
          type: "ATTRIBUTES",
        },
        {
          entityType: "DEVICE",
          entityId: id,
          scope: "SHARED_SCOPE",
          cmdId: 12,
          type: "ATTRIBUTES",
        },
      ]);

      const message = {
        authCmd: { cmdId: 0, token },
        cmds,
      };

      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      try {
        const received = JSON.parse(event.data);    
        const scope = subscriptionIdToScope[received.subscriptionId];
        const data = received.data;                
    
setAttributesData((prev) => {
  const updated = {
    ...prev,
    [scope]: {
      ...(prev[scope] || {}),
      ...data,
    },
  };
  return updated;
});

      } catch (error) {
        console.error("WebSocket data parsing error:", error);
      }
    };
    
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      console.log("Cleaning up WebSocket");
      ws.close();
    };
  }, [token, deviceIds]);

  return { attributesData };
};
