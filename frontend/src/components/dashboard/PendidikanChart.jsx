// src/components/dashboard/PendidikanChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Palet warna yang lebih beragam untuk banyak kategori
const COLORS = [
  "#0ea5e9", // sky-500
  "#8b5cf6", // violet-500
  "#10b981", // emerald-500
  "#f97316", // orange-500
  "#ef4444", // red-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
];

const PendidikanChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border h-full flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Komposisi Pendidikan
        </h3>
        <div className="flex-grow flex items-center justify-center text-gray-500">
          <p>Data pendidikan tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border h-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Komposisi Pendidikan
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} orang`} />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PendidikanChart;
