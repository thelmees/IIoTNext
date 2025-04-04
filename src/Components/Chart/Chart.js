import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const {data:devices,loading,error} = useSelector((state)=>state.API)

    useEffect(() => {
     
    }, []);
  
    const activeCount = devices.filter((device) => device.isActive).length;
    const inactiveCount = devices.length - activeCount;
    
  const data = {
    labels: ["Active Device", "Inactive Device"],
    margin:1,
    datasets: [
      {
        label: ['Devices'],
        data: [activeCount,inactiveCount], 
        backgroundColor: ["#129212","#cd0000"],
        hoverBackgroundColor: ["#12a412", "#e04e2e"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    
  };

  

  return (
    <div style={{ width: "290px", height: "250px" ,marginTop:'20px'}}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;