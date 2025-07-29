// src/routes/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout"; // <-- Impor MainLayout
import PegawaiListPage from "../pages/PegawaiListPage"; // <-- Import halaman baru
import UsulanListPage from "../pages/UsulanListPage"; // <-- Impor halaman baru
import UsulanDetailPage from "../pages/UsulanDetailPage"; // <-- Impor halaman baru
import DeteksiOtomatisPage from "../pages/DeteksiOtomatisPage"; // <-- Impor halaman baru
import PegawaiDetailPage from "../pages/PegawaiDetailPage"; // <-- Impor halaman baru
import PengaturanPage from "../pages/PengaturanPage"; // <-- Impor halaman baru
import KinerjaPage from "../components/KinerjaPage";
import AnalitikPage from "../pages/AnalitikPage"; // <-- Impor halaman baru
import LaporanPage from "../pages/LaporanPage"; // <-- Impor halaman baru
import LaporanDukPage from "../pages/LaporanDukPage"; // <-- Impor halaman baru

const AppRouter = () => {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />

      {/* Rute yang Dilindungi kini menggunakan MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pegawai" element={<PegawaiListPage />} />
          <Route path="/usulan" element={<UsulanListPage />} />
          <Route path="/usulan/:id" element={<UsulanDetailPage />} />{" "}
          {/* <-- Tambahkan rute ini */}
          <Route path="/deteksi" element={<DeteksiOtomatisPage />} />
          <Route path="/pegawai/:id" element={<PegawaiDetailPage />} />
          <Route path="/pengaturan" element={<PengaturanPage />} />
          <Route path="/kinerja" element={<KinerjaPage />} />
          <Route path="/analitik" element={<AnalitikPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/laporan-duk" element={<LaporanDukPage />} />
          {/* Tambahkan rute lainnya sesuai kebutuhan */}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
