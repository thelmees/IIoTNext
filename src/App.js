import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/login';
import DeviceList from './Components/DeviceList/deviceList';
import Telemetry from './Components/Telemetry/Telemetry';
import Layout from './Components/Sidebar/layout';
import Devices from './Components/Devices/Devices';
import TelemetryTable from './Components/TelemetryTable/TelemetryTable';
import AttributesTable from './Components/AttributesTable/AttributesTable';
import BasicConfiguration from "./Components/Basic Configuration/BasicConfiguration"
import LogConfiguration from './Components/LogConfiguration/LogConfiguration';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/deviceList" element={<DeviceList />} />
          <Route path="/device" element={<Devices />} />
          <Route path="/Telemetry Configuration/:deviceId" element={<Telemetry />} />
          <Route path="/telemetry/:deviceId" element={<TelemetryTable />} />
          <Route path="/attributes/:deviceId" element={<AttributesTable />} />
          <Route path="/basic Configuration/:deviceId" element={<BasicConfiguration />} />
          <Route path="/log Configuration/:deviceId" element={<LogConfiguration />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;

