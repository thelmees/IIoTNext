import React from "react";
import Header from "../Header/header";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <div className="body-section">
        <Sidebar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

