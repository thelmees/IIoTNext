import React from 'react';
import './header.css'; 
import { useDevice } from '../../DeviceContext';
import Consyst from '../../assets/consyst.webp'

const Header = () => {
  const { selectedDeviceName } = useDevice();

  return (
    <header className="app-header">
      <img src={Consyst}/>
      {selectedDeviceName && (
        <div className="device-name"><strong>{selectedDeviceName}</strong></div>
      )}
    </header>
  );
};

export default Header;
