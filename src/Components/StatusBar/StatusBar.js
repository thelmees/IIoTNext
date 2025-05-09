import React, { useContext, useEffect } from 'react';
import './StatusBar.css';
import { DownloadWebSocketContext } from '../Web Socket/DownloadStatusWebSocket';

const DownloadStatusBar = ({ deviceId }) => {
    const { downloadPercent, downloadState, downloadWarning, setDeviceId, } = useContext(DownloadWebSocketContext);

    const getWarningColor = (value) => {
        const warningMap = {
          "None": "#31A95E",
          "Prohibited": "#fcc74c",
          "No URL!": "#fcc74c",
          "No Local Path!": "#ffde21",
          "Server Disconnected!": "red",
          "Storage Full!": "red",
          "Moved Permanently (301)": "#fcc74c",
          "Bad Request (400)": "#fcc74c",
          "Forbidden (403)": "red",
          "File Not Found (404)": "#fcc74c",
        };
      
        return warningMap[value];
      };


    useEffect(() => {
        if (deviceId) {
            setDeviceId(deviceId);
        }
    }, [deviceId, setDeviceId, downloadPercent, downloadState, downloadWarning]);

    return (
        <div className="download-status-container">
            <div className='progress-info'>
                <span className="progress-state">{downloadState}</span>
                <span className="progress-percent">{(downloadPercent || 0).toFixed(1)}%</span>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{width: `${downloadPercent}%`,}}>
                   <span className='progress-text'>Download Status</span>
                </div>
            </div>
            <div className="warning">
                <span>Warning :</span>{" "}
                <span style={{ color: getWarningColor(downloadWarning) }}>
                    {downloadWarning}
                </span>
            </div>
        </div>
    );
};

export default DownloadStatusBar;




