// src/components/dashboard/MasaKerjaChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MasaKerjaChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        Distribusi Masa Kerja
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#14b8a6" name="Jumlah Pegawai" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MasaKerjaChart;
