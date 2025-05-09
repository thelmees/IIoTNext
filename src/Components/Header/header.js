import React from 'react';
import './header.css';
import { useDevice } from '../../DeviceContext';
import Consyst from '../../assets/consyst.webp';
import { Link } from 'react-router-dom';
import { menuItems } from '../../config';

const Header = () => {
  const { selectedDeviceName, selectedComponent, selectedDeviceId, setSelectedComponent } = useDevice();

  const handleBreadcrumbClick = () => {
    setSelectedComponent("Telemetry Configuration");
  };
  
  return (
    <header className="app-header">
      <Link to="/deviceList" className="logo-link">
        <img src={Consyst} alt="Consyst Logo" className="logo" />
      </Link>
      {selectedDeviceName && (
        <div className="breadcrumb">
          <Link to="/deviceList" className="breadcrumb-item">
            Home
          </Link>
          <span className="breadcrumb-separator">{'>'}</span>
          <Link to={`/Telemetry Configuration/${selectedDeviceId}`} className="breadcrumb-item" onClick={handleBreadcrumbClick}>
            {selectedDeviceName}
          </Link>
          <span className="breadcrumb-separator">{'>'}</span>
          <Link to={`/${selectedComponent}/${selectedDeviceId}`} className="breadcrumb-item">
            {selectedComponent}
          </Link>
        </div>
      )}

      {selectedDeviceName && (
        <div className="device-name">
          <strong>{selectedDeviceName}</strong>
        </div>
      )}
    </header>
  );
};

export default Header;


