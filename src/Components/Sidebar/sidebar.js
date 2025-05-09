import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./sidebar.css";
import { menuItems } from "../../config";
import { useDevice } from "../../DeviceContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const segment = path.split('/').filter(Boolean)[0];
  const [activeIndex, setActiveIndex] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerHeight < 550);
  const { selectedDeviceId, setSelectedDeviceId, setSelectedDeviceName, setSelectedComponent } = useDevice();


  useEffect(() => {
    const path = location.pathname;
    const segment = path.split("/").filter(Boolean)[0] || "";
    const index = menuItems.findIndex(
      (item) => item.path === `/${segment}` || (segment === "" && item.path === "/")
    );
    setActiveIndex(index !== -1 ? index : 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerHeight < 550);
      setActiveIndex(segment)
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
    setSelectedComponent(item.name)

    if (item.path === "/deviceList") {
      setSelectedDeviceId(null);
      setSelectedDeviceName(null)
    }

    if (item.name === "Log Out") {
      localStorage.removeItem("token");
      setSelectedDeviceId(null);
      sessionStorage.removeItem("selectedDeviceId");
    }

    navigate(item.path);
  };

  return (
    <div className="sidebar expanded">
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <div
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

          {item.children && selectedDeviceId && (
            <div className="submenu">
              {item.children.map((child, childIndex) => {
                const childPath = child.path.replace(":Id", selectedDeviceId);
                const isActive = location.pathname === childPath;
                return (
                  <div
                    key={childIndex}
                    className={`submenu-item ${isActive ? "submenu-item-active" : ""}`}
                    onClick={() => {
                      navigate(child.path.replace(":Id", selectedDeviceId))
                      setSelectedComponent(child.name)
                    }}
                  >
                    <p className="submenu-text">{child.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>

  );
};

export default Sidebar;
