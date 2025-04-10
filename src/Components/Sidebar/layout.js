import React from "react";
import Sidebar from "./sidebar";
import "./sidebar.css";
import { Outlet } from "react-router-dom";
import Header from "../Header/header";

const Layout = () => {
  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
