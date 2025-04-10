import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerHeight < 550);

  const menuItems = [
    { name: "Dashboards", iconName: "dashboard", color: "white", type: "solid", path: "/deviceList" },
    { name: "Devices", iconName: "devices", color: "white", path: "/device" },
    { name: "Log Out", iconName: "log-out", color: "red", rotate: "180", path: "/" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerHeight < 550);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 800);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const handleClick = (item, index) => {
    setActiveIndex(index);

    if (item.name === "Log Out") {
      localStorage.removeItem("token");
    }

    navigate(item.path);
  };

  return (
    <div className="sidebar expanded">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`boxicon-container expanded-boxicon-container`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleClick(item, index)}
        >
          <box-icon
            className={`boxicon ${activeIndex === index ? "active" : ""}`}
            size={isSmall ? "sm" : "md"}
            name={item.iconName}
            type={item.type}
            color={hoveredIndex === index || activeIndex === index ? "white" : item.color}
            animation={activeIndex === index && animate ? "tada" : ""}
            rotate={item.rotate}
          ></box-icon>
          <p className={`description show-description ${activeIndex === index ? "active-description" : ""}`}>
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
