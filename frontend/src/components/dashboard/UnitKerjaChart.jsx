// src/components/dashboard/UnitKerjaChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- PALET WARNA STATIS ---
// Palet warna yang sudah ditentukan agar tidak berubah setiap kali refresh.
// Anda bisa menambah atau mengubah warna ini sesuai selera.
const COLORS = [
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#64748b",
];

const UnitKerjaChart = ({ data }) => {
  // Menghitung total untuk kalkulasi persentase
  const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4">
        Pegawai per Unit Kerja
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            // --- PERUBAHAN DI SINI: Menampilkan nama dan persentase ---
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              // Menggunakan warna dari palet statis
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              `${value} pegawai (${((value / totalValue) * 100).toFixed(1)}%)`
            }
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UnitKerjaChart;
