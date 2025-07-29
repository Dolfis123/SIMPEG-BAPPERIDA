// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth(); // <-- AMBIL STATUS LOADING

  // Jika masih dalam proses pengecekan token, tampilkan sesuatu (misal: spinner)
  if (loading) {
    return <div>Loading...</div>; // Atau komponen spinner yang lebih bagus
  }

  // Setelah loading selesai, baru lakukan pengecekan token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;