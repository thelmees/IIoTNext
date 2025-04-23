import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/login';
import DeviceList from './Components/DeviceList/deviceList';
import Telemetry from './Components/Telemetry/Telemetry';
import Layout from './Components/Sidebar/layout';
import Devices from './Components/Devices/Devices';
import TelemetryTable from './Components/TelemetryTable/TelemetryTable';
import AttributesTable from './Components/AttributesTable/AttributesTable';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/deviceList" element={<DeviceList />} />
          <Route path="/device" element={<Devices/>} />
          <Route path="/telemetry/:deviceId" element={<Telemetry />} />
          <Route path="/telemetryTable/:deviceId" element={<TelemetryTable/>} />
          <Route path="/attributes/:deviceId" element={<AttributesTable/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

