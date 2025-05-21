import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chart } from "react-google-charts";

const GoogleDonutChart = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { data: devices, loading, error } = useSelector((state) => state.API);

  useEffect(() => {
    // Fetch logic if needed
  }, []);

  const activeCount = devices.filter((device) => device.isActive).length;
  const inactiveCount = devices.length - activeCount;

  const chartData = [
    ["Device Status", "Count"],
    ["Active Device", activeCount],
    ["Inactive Device", inactiveCount],
  ];

  const options = {
    pieHole: 0.7,
    is3D: false,
    colors: ["#129212", "#cd0000"],
    legend: {
      position: "top",
      textStyle: { fontSize: 12,},
    },
    chartArea: {width: "100%",height: "80%",},
    tooltip: {trigger: "focus",},
    pieSliceText: "none",
  };

  return (
    <div style={{ width: "290px", height: "230px", marginTop: "20px",}}>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={options}
        width={"100%"}
        height={"100%"}
      />
    </div>
  );
};

export default GoogleDonutChart;


