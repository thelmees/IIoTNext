import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './deviceList.css';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { OverlayPanel } from 'primereact/overlaypanel';
import DonutChart from '../Chart/Chart';
import Map from '../Map/Map';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices } from '../../Redux/Slices/deviceSlice';
import { useWebSocket } from '../Web Socket/deviceListWebSocket';

function DeviceList() {
  const [searchValues, setSearchValues] = useState({});
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dispatch = useDispatch()
  const {data:devices,loading,error} = useSelector((state)=>state.API)
  const {status} = useWebSocket()

  useEffect(() => {
    dispatch(fetchDevices())
    
  }, [dispatch,status]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  const formatCreatedTime = (timestamp) => { 
    if (!timestamp) return "Invalid Data";
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").split(".")[0];
  };

  const TimeAgo = (timestamp) => {
    if (!timestamp) return "N/A";
    return formatDistanceToNow(new Date(Number(timestamp)), { addSuffix: true });
  };

  function getDeviceAttribute(additionalInfo, key) {
    if (!Array.isArray(additionalInfo)) return "";
    const attribute = additionalInfo.find(attr => attr.key === key);
    return attribute ? attribute.value : "";
  }

  const transformedDevices = devices.map(device => ({
    ...device,
    createdOn: formatCreatedTime(getDeviceAttribute(device.additionalInfo, "createdTime")),
    macId: getDeviceAttribute(device.additionalInfo, "info_macaddr"),
    status: getDeviceAttribute(device.additionalInfo, "active"),
    fwVersion: getDeviceAttribute(device.additionalInfo, "info_fwversion"),
    wan: getDeviceAttribute(device.additionalInfo, "info_type"),
    lastActivity: TimeAgo(getDeviceAttribute(device.additionalInfo, "lastActivityTime")),
  }));

  const handleSearchChange = (field, value) => {
    setSearchValues((prev) => ({ ...prev, [field]: value }));
  };

  const filteredDevices = transformedDevices.filter((device) =>
    Object.keys(searchValues).every((key) =>
      device[key]?.toString().toLowerCase().includes(searchValues[key]?.toLowerCase() || "")
    )
  );

  const headerFilter = (
    <div  style={{ display: "flex", flexDirection: "column" }}>
    Device Name
    <InputText style={{marginTop:"10px",width:"150px",height:"20px"}} onChange={(e) => handleSearchChange("name", e.target.value)} placeholder="search" />
  </div>
  );

  return (
    <div className="card">
      <div className="header">
        <p className='device-heading'>Device Management Home</p>
        
        <i className="pi pi-bars menu-icon" onClick={(e) => menuRef.current.toggle(e)}></i>
        
        <OverlayPanel ref={menuRef}>
          <ul className="logout">
            <li onClick={handleLogout}><i className="pi pi-sign-out"></i> Logout</li>
          </ul>
        </OverlayPanel>
      </div>
      <DataTable value={filteredDevices} tableStyle={{ minWidth: '50rem' }} className="custom-table" 
        scrollable scrollHeight='370px' onRowClick={(e) => navigate(`/telemetry/${e.data.id.id}`)}>
        <Column field="name" header={headerFilter}/> 
        <Column field="createdOn" header="Created On" sortable ></Column>
        <Column field="macId" header="Mac ID" sortable></Column>
        <Column field="status" header="Status" body={(rowData) => (
          <span className={`status ${rowData.status === true ? "green" : "red"}`}>
            <i className={`pi ${rowData.status === true ? "pi-check-circle" : "pi-times-circle"}`}></i></span>)} sortable>
        </Column>
        <Column field="lastActivity" header="Activity"></Column>
        <Column field="fwVersion" header="FW Version" sortable></Column>
        <Column field="wan" header="WAN" sortable></Column>
      </DataTable>
      <div className='components'>
        <DonutChart />
        <Map />
      </div>
    </div>
  );
}

export default DeviceList;

