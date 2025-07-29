// src/components/dashboard/AgeChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AgeChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Distribusi Usia Pegawai</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Jumlah Pegawai" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgeChart;
