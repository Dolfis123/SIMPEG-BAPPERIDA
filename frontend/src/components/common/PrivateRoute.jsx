// src/components/common/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Komponen untuk melindungi rute.
 * @param {object} props
 * @param {React.ReactNode} props.children - Komponen halaman yang akan ditampilkan jika otorisasi berhasil.
 * @param {string[]} props.roles - Array berisi role yang diizinkan mengakses halaman.
 */
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Tampilkan loading jika status autentikasi masih diperiksa
  // Ini penting untuk mencegah "kedipan" ke halaman login saat refresh.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  // 2. Jika pengecekan selesai dan tidak ada user (belum login),
  // arahkan ke halaman login. Simpan lokasi saat ini agar bisa kembali setelah login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Jika ada user, cek apakah rolenya diizinkan untuk mengakses halaman ini.
  // 'roles' adalah prop yang kita kirim dari AppRouter (contoh: ['super_admin']).
  if (roles && !roles.includes(user.role)) {
    // Jika role tidak cocok, "lempar" pengguna ke halaman dashboard.
    // Anda juga bisa membuat halaman khusus "Tidak Diizinkan" (403 Forbidden).
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Jika semua pengecekan lolos (sudah login dan role sesuai),
  // tampilkan halaman yang seharusnya (children).
  return children;
};

export default PrivateRoute;
