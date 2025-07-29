// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Menu, User, LogOut, Bell, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

// Fungsi untuk mendapatkan judul halaman dari path
const getPageTitle = (pathname) => {
  const name = pathname.split("/").pop();
  if (name === "dashboard" || !name) return "Dashboard";
  return name.charAt(0).toUpperCase() + name.slice(1).replace("-", " ");
};

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FUNGSI BARU UNTUK MENANGANI LOGOUT ---
  const handleLogout = () => {
    // 1. Tampilkan dialog konfirmasi
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin keluar dari aplikasi?"
    );

    // 2. Jika pengguna menekan "OK", jalankan fungsi logout
    if (isConfirmed) {
      logout();
    }
    // Jika pengguna menekan "Cancel", tidak terjadi apa-apa.
  };

  return (
    <header className="bg-white h-20 flex items-center justify-between px-4 sm:px-6 relative z-30 border-b border-gray-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-500 hover:text-indigo-600 mr-4"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 hidden md:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="text-gray-500 hover:text-indigo-600 relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="font-semibold text-sm capitalize">
                {user ? user.role.replace("_", " ") : "Pengguna"}
              </span>
              <span className="text-xs text-gray-500">
                {user ? user.username : "NIP"}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-2xl py-2 ring-1 ring-black ring-opacity-5">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={16} /> Profil Saya
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              {/* --- PERUBAHAN DI SINI --- */}
              <button
                onClick={handleLogout} // Memanggil fungsi handleLogout, bukan logout langsung
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
