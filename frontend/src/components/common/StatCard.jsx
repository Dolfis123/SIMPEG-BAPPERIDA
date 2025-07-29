// src/components/common/StatCard.jsx
import React from "react";

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div
        className={`p-3 rounded-full text-white ${
          colorClasses[color] || "bg-gray-500"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
