import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";
import { menuItems } from "../../config";
import { useDevice } from "../../DeviceContext";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [isSmall, setIsSmall] = useState(window.innerHeight < 550);
  const [openGroups, setOpenGroups] = useState({});
  const { selectedDeviceId, setSelectedDeviceId, setSelectedDeviceName, setSelectedComponent } = useDevice();
  const contentRef = useRef(null);  

  useEffect(() => {
    const segment = location.pathname.split("/").filter(Boolean)[0] || "";
    const index = menuItems.findIndex(
      (item) => item.path === `/${segment}` || (segment === "" && item.path === "/")
    );
    setActiveIndex(index !== -1 ? index : 0);
  }, [location.pathname]);

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
    if (!item.path && item.isGroup) {
      setOpenGroups((prev) => ({ ...prev, [item.name]: !prev[item.name] }));
      return;
    }

    setActiveIndex(index);
    setSelectedComponent(item.name);

    if (item.path === "/deviceList") {
      setSelectedDeviceId(null);
      setSelectedDeviceName(null);
    }

    if (item.name === "Log Out") {
      localStorage.removeItem("token");
      setSelectedDeviceId(null);
      sessionStorage.removeItem("selectedDeviceId");
    }

    if (item.path) navigate(item.path);
  };

  const renderChildren = (children) => {
    return children.map((child, index) => {
      if (child.isGroup) {
        return (
          <div key={index} className="submenu-group">
            <div
              className="submenu-group-title"
              onClick={() =>
                setOpenGroups((prev) => ({
                  ...prev,
                  [child.name]: !prev[child.name]
                }))
              }
            >
              {child.name}
              <div className={`conf_drop_down ${openGroups[child.name] ? 'open' : ''}`}>
                <IoIosArrowDown />
              </div>
            </div>
            <div ref={contentRef} className="submenu-group-content" style={{
              maxHeight: openGroups[child.name] ? `${contentRef.current?.scrollHeight}px`: "0px",
              opacity:  openGroups[child.name] ? 1 : 0,
            }}>
        {renderChildren(child.children)}
      </div>
          </div>
        );
      }

      const childPath = child.path.replace(":Id", selectedDeviceId);
      const isActive = location.pathname === childPath;

      return (
        <div
          key={index}
          className={`submenu-item ${isActive ? "submenu-item-active" : ""}`}
          onClick={() => {
            navigate(childPath);
            setSelectedComponent(child.name);
          }}
        >
          <p className="submenu-text">{child.name}</p>
        </div>
      );
    });
  };

  return (
    <div className="sidebar expanded">
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <div
            className="boxicon-container expanded-boxicon-container"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleClick(item, index)}
          >
            <box-icon
              className={`boxicon ${activeIndex === index ? "active" : ""}`}
              size={isSmall ? "sm" : "md"}
              name={item.iconName}
              type={item.type}
              color={
                hoveredIndex === index || activeIndex === index
                  ? "white"
                  : item.color
              }
              animation={activeIndex === index && animate ? "tada" : ""}
              rotate={item.rotate}
            ></box-icon>
            <p className={`description show-description ${activeIndex === index ? "active-description" : ""}`}>
              {item.name}
            </p>
          </div>

          {item.children && selectedDeviceId && (
            <div className="submenu">
              {renderChildren(item.children)}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Sidebar;


