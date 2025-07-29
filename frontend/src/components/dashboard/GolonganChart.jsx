// src/components/dashboard/GolonganChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GolonganChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Distribusi Golongan</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={data} 
          layout="vertical" // Membuat grafik menjadi horizontal bar
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={50} />
          <Tooltip cursor={{fill: '#f1f5f9'}} />
          <Bar dataKey="value" fill="#4f46e5" name="Jumlah Pegawai" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GolonganChart;
