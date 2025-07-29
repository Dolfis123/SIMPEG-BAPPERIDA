// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Halaman Tidak Ditemukan</p>
      <Link to="/login" className="mt-6 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">
        Kembali ke Halaman Login
      </Link>
    </div>
  );
};

export default NotFoundPage;