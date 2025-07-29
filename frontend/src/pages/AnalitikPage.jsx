// src/pages/AnalitikPage.jsx
import React, { useState, useEffect } from "react";
import { getFullAnalytics } from "../api/dashboardService";
import { Loader2, AlertTriangle } from "lucide-react";
import GenderChart from "../components/dashboard/GenderChart";
import PendidikanChart from "../components/dashboard/PendidikanChart";
import GolonganChart from "../components/dashboard/GolonganChart";
import AgeChart from "../components/dashboard/AgeChart";
import MasaKerjaChart from "../components/dashboard/MasaKerjaChart";
import UnitKerjaChart from "../components/dashboard/UnitKerjaChart";

const AnalitikPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFullAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        setError("Gagal memuat data analitik. Silakan coba lagi nanti.");
        console.error(err);
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
          Memuat Data Analitik...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-700 bg-red-100 rounded-lg flex items-center gap-4">
        <AlertTriangle className="h-8 w-8" />
        <div>
          <h3 className="font-bold">Terjadi Kesalahan</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analitik Kepegawaian
        </h1>
        <p className="text-base text-gray-600 mt-1">
          Visualisasi data demografi dan kinerja pegawai Bapperida.
        </p>
      </div>

      {/* Grid untuk menampung semua chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {analyticsData?.gender && <GenderChart data={analyticsData.gender} />}
        {analyticsData?.pendidikan && (
          <PendidikanChart data={analyticsData.pendidikan} />
        )}
        {analyticsData?.golongan && (
          <GolonganChart data={analyticsData.golongan} />
        )}
        {analyticsData?.age && <AgeChart data={analyticsData.age} />}
        {analyticsData?.masaKerja && (
          <MasaKerjaChart data={analyticsData.masaKerja} />
        )}
        {analyticsData?.unitKerja && (
          <UnitKerjaChart data={analyticsData.unitKerja} />
        )}
      </div>
    </div>
  );
};

export default AnalitikPage;
