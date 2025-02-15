import React from "react";
import Chart from "react-apexcharts";
import { Ellipsis } from "lucide-react";

const PlansChart = () => {
  const options = {
    chart: {
      type: "radialBar",
      height: 200,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "30%",
        },
        track: {
          background: "#f2f2f2",
        },
        dataLabels: {
          show: true,
          name: {
            fontSize: "14px",
            color: "#333",
          },
          value: {
            show: false,
          },
        },
      },
    },
    labels: ["Active", "Renewal", "Cancel"],
    colors: ["#4CAF50", "#FFD700", "#FF5733"],
  };

  const series = [75, 50, 30];

  return (
    <div className="bg-white rounded-[30px] shadow-lg w-full px-4 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-HelveticaNeueMedium text-darkColor">
          Plans
        </h2>
        <Ellipsis size={30} className="text-darkColor/40"/>
      </div>

      <div className="relative flex justify-center items-center">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={200}
        />
        <div className="absolute text-darkColor font-HelveticaNeueMedium text-base">
          SS
        </div>
      </div>

      {/* Legend */}
      <div className="w-[60%] mx-auto">
        <div className="flex items-center space-x-2 font-HelveticaNeueMedium">
          <span className="w-3 h-3 bg-[#68DE50] rounded-full"></span>
          <span className="text-sm text-darkColor/50 pl-2">Active</span>
          <span className="text-sm text-darkColor/50 pl-4">10,087+</span>
        </div>
        <div className="flex items-center space-x-2 font-HelveticaNeueMedium">
          <span className="w-3 h-3 bg-[#FFEF5B] rounded-full"></span>
          <span className="text-sm text-darkColor/50 pl-2">Renewal</span>
          <span className="text-sm text-darkColor/50 pl-4">309+</span>
        </div>
        <div className="flex items-center space-x-2 font-HelveticaNeueMedium">
          <span className="w-3 h-3 bg-[#FF3115] rounded-full"></span>
          <span className="text-sm text-darkColor/50 pl-2">Cancel</span>
          <span className="text-sm text-darkColor/50 pl-4">16</span>
        </div>
      </div>
    </div>
  );
};

export default PlansChart;
