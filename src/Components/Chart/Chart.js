import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DonutChart = () => {

  const { data: devices } = useSelector((state) => state.API);

  const activeCount = devices.filter((device) => device.isActive).length;
  const inactiveCount = devices.length - activeCount;

  const chartData = [
    { name: "Active Device", value: activeCount },
    { name: "Inactive Device", value: inactiveCount },
  ];

  const COLORS = ["#129212", "#cd0000"];

  const renderCustomLegend = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "10px",marginBottom:"10px"}}
      >
        {chartData.map((entry, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>

            <div style={{width: 12, height: 12, backgroundColor: COLORS[index],}}></div>

            <span style={{fontSize: "14px", color: "black", fontWeight: 500,}}>{entry.name}</span>

          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: "350px", height: "230px",}}>

      {renderCustomLegend()}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            paddingAngle={1}
            strokeWidth={1}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="white"
                strokeWidth={1}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;

