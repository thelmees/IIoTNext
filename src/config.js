export const API_BASE_URL = "https://app.iiotnext.com/api"

export const defaultAttributes = {
    onchange_interval: "",
    mqtt2: 0,
    onchange_send: 0,
    onchangetags: "",
    mqtt_host: "",
    mqtt_port: "",
    mqtt_user: "",
    mqtt_pass: "",
    mqtt_topic: "",
    mqtt_is_secure: 0,
    mqtt_keepalive: "",
    mqtt_qos: "",
  };

  export const params = "createdTime,info_macaddr,active,lastActivityTime,info_fwversion,info_type"



  export const menuItems = [
    {
      name: "Home",
      iconName: "home",
      color: "white",
      type: "solid",
      path: "/deviceList",
      children: [
        { name: "Telemetry Configuration", path: "/telemetry/:Id" },
        { name: "Telemetry", path: "/telemetryTable/:Id" },
        { name: "Attribute", path: "/attributes/:Id" },
      ],
    },
    { name: "Log Out", iconName: "log-out", color: "red", rotate: "180", path: "/" },
  ];