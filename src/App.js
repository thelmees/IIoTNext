import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/login';
import DeviceList from './Components/DeviceList/deviceList';
import Telemetry from './Components/Telemetry/Telemetry';
import Sidebar from './Components/Sidebar/sidebar';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/deviceList" element={<DeviceList />} />
        <Route path="/telemetry/:deviceId" element={<Telemetry />} />
      </Routes>
    </div>
  );
}

export default App;
