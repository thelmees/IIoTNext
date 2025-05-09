import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WebSocketProvider } from './Components/Web Socket/webSocketContext';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import { DeviceProvider } from './DeviceContext';
import { DownloadWebSocketProvider } from './Components/Web Socket/DownloadStatusWebSocket';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WebSocketProvider>
    <BrowserRouter>
    <Provider store={store}>
    <DeviceProvider>
    <App />
    </DeviceProvider>
    </Provider>
    </BrowserRouter>
  </WebSocketProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
