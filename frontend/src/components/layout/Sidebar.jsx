// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Zap,
  ClipboardCheck,
  Printer,
  BarChart2, // <-- 1. Impor ikon BarChart2
} from "lucide-react";
import Logo from "../../assets/images/pbd.jpg";

const NavGroup = ({ title, children }) => (
  <div className="mt-6">
    <h3 className="px-4 mb-2 text-xs font-semibold uppercase text-gray-400 tracking-wider">
      {title}
    </h3>
    <ul>{children}</ul>
  </div>
);

const NavItem = ({ to, icon, children }) => {
  const baseClasses =
    "flex items-center px-4 py-2.5 my-1 rounded-lg transition-colors duration-200 font-medium text-sm";
  const activeLinkClasses = "bg-indigo-700 text-white shadow-inner";
  const inactiveLinkClasses =
    "text-gray-300 hover:bg-indigo-500 hover:text-white";

  return (
    <li>
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
        }
      >
        {icon}
        {children}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside
      className={`
        bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col
        fixed md:sticky inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } 
        md:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-xl
      `}
    >
      <div className="h-20 border-b border-gray-700 flex items-center justify-center px-4">
        <img src={Logo} alt="Logo" className="h-10 w-auto rounded-md" />
        <h1 className="ml-3 text-2xl font-bold text-white tracking-tight">
          SIMPEG
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <NavGroup title="Utama">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={20} className="mr-3" />}
          >
            Dashboard
          </NavItem>
          <NavItem to="/deteksi" icon={<Zap size={20} className="mr-3" />}>
            Deteksi Otomatis
          </NavItem>
        </NavGroup>

        <NavGroup title="Manajemen">
          <NavItem to="/pegawai" icon={<Users size={20} className="mr-3" />}>
            Data Pegawai
          </NavItem>
          <NavItem
            to="/kinerja"
            icon={<ClipboardCheck size={20} className="mr-3" />}
          >
            Kinerja (SKP)
          </NavItem>
          <NavItem to="/usulan" icon={<FileText size={20} className="mr-3" />}>
            Proses Usulan
          </NavItem>
        </NavGroup>

        <NavGroup title="Lainnya">
          {/* --- 2. MENU ANALITIK DITAMBAHKAN DI SINI --- */}
          <NavItem
            to="/analitik"
            icon={<BarChart2 size={20} className="mr-3" />}
          >
            Analitik
          </NavItem>
          <NavItem to="/laporan" icon={<Printer size={20} className="mr-3" />}>
            Cetak Laporan
          </NavItem>
          <NavItem
            to="/laporan-duk"
            icon={<Printer size={20} className="mr-3" />}
          >
            Laporan D.U.K
          </NavItem>
          <NavItem
            to="/pengaturan"
            icon={<Settings size={20} className="mr-3" />}
          >
            Pengaturan
          </NavItem>
        </NavGroup>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Bapperida PBD
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
