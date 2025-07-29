// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Loader2,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { getDashboardStats, getRecentUsulan } from "../api/dashboardService";

// Komponen Kartu Statistik yang didesain ulang
const StatCard = ({ icon, title, value, color, link }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Link
      to={link}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600">
        <span>Lihat Detail</span>
        <ArrowRight size={14} className="ml-1" />
      </div>
    </Link>
  );
};

// Komponen Badge Status
const StatusBadge = ({ status }) => {
  const baseStyle = "text-xs font-semibold px-3 py-1 rounded-full inline-block";
  let colorStyle = "";

  switch (status) {
    case "Diajukan":
      colorStyle = "bg-blue-100 text-blue-800";
      break;
    case "Disetujui":
      colorStyle = "bg-emerald-100 text-emerald-800";
      break;
    case "Ditolak":
      colorStyle = "bg-red-100 text-red-800";
      break;
    default:
      colorStyle = "bg-gray-100 text-gray-800";
      break;
  }
  return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, activitiesData] = await Promise.all([
          getDashboardStats(),
          getRecentUsulan(),
        ]);
        setStats(statsData);
        setRecentActivities(activitiesData);
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="mt-3 text-lg font-medium text-gray-600">
          Memuat Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            Selamat Datang, {user ? user.role.replace("_", " ") : "Pengguna"}!
          </h1>
          <p className="text-base text-gray-600 mt-1">
            Berikut adalah ringkasan aktivitas sistem hari ini.
          </p>
        </div>
        <button
          onClick={() => navigate("/usulan")}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors w-full sm:w-auto"
        >
          <PlusCircle size={20} />
          Buat Usulan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users size={24} />}
          title="Total Pegawai Aktif"
          value={stats.totalPegawai || 0}
          color="blue"
          link="/pegawai"
        />
        <StatCard
          icon={<FileText size={24} />}
          title="Usulan Diproses"
          value={stats.usulanDiproses || 0}
          color="yellow"
          link="/usulan"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          title="Usulan Disetujui"
          value={stats.usulanDisetujui || 0}
          color="green"
          link="/usulan"
        />
        <StatCard
          icon={<AlertTriangle size={24} />}
          title="Peringatan Mendatang"
          value={stats.peringatanKGB || 0}
          color="red"
          link="/deteksi"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Aktivitas Terbaru</h2>
          <p className="text-sm text-gray-500 mt-1">
            Daftar usulan yang baru-baru ini diajukan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Pegawai</th>
                <th className="px-6 py-4">Jenis Usulan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">
                        {activity.Pegawai?.nama_lengkap}
                      </p>
                      <p className="text-gray-500">{activity.Pegawai?.nip}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {activity.jenis_usulan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={activity.status_usulan} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/usulan/${activity.id}`}
                        className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16 px-4">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Inbox size={48} className="mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-gray-700">
                        Tidak Ada Aktivitas Terbaru
                      </h3>
                      <p className="mt-1">
                        Belum ada usulan yang diajukan baru-baru ini.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
