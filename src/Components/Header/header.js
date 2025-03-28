import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OverlayPanel } from "primereact/overlaypanel";
import "primeicons/primeicons.css";
import "./header.css";

const Header = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="header">
      <h2 className="logo" onClick={() => navigate("/deviceList")}>
        <i style={{margin:"5px",fontSize:"16px"}} className="pi pi-chevron-left"></i>Home</h2>
      <i className="pi pi-bars menu-icon" onClick={(e) => menuRef.current.toggle(e)}></i>
      <OverlayPanel ref={menuRef}>
        <ul className="menu">
          <li onClick={handleLogout}>
            <i className="pi pi-sign-out"></i> Logout
          </li>
        </ul>
      </OverlayPanel>
    </div>
  );
};

export default Header;