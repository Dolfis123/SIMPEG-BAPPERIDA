// src/components/PegawaiTable.jsx
import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { hitungJadwalKP, hitungJadwalKGB } from "../utils/dateHelper";

const getScheduleBadge = (scheduleText) => {
  const baseClasses =
    "text-xs font-semibold px-2.5 py-1 rounded-full inline-block whitespace-nowrap";
  if (!scheduleText || scheduleText === "-")
    return `bg-gray-100 text-gray-700 ${baseClasses}`;

  const text = scheduleText.status ? scheduleText.status.toLowerCase() : "";

  if (text.includes("segera")) return `bg-red-100 text-red-800 ${baseClasses}`;
  if (text.includes("bulan lagi"))
    return `bg-amber-100 text-amber-800 ${baseClasses}`;
  if (text.includes("tahun lagi"))
    return `bg-emerald-100 text-emerald-800 ${baseClasses}`;
  return `bg-gray-100 text-gray-700 ${baseClasses}`;
};

const PegawaiTable = ({ pegawai, offset, onEdit, onDelete }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi helper untuk memotong teks
  const truncateText = (text, maxLength) => {
    if (!text) return "-";
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold tracking-wider">
          <tr>
            <th className="px-6 py-3">No</th>
            <th className="px-6 py-3">Nama Lengkap</th>
            <th className="px-6 py-3">NIP</th>
            <th className="px-6 py-3">Jabatan</th>
            <th className="px-6 py-3">Golongan</th>
            <th className="px-6 py-3">Jadwal KP</th>
            <th className="px-6 py-3">Jadwal KGB</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 divide-y divide-gray-200">
          {pegawai.length > 0 ? (
            pegawai.map((p, index) => {
              const jadwalKP = hitungJadwalKP(p.tmt_pangkat_terakhir);
              const jadwalKGB = hitungJadwalKGB(p.tmt_kgb_terakhir);

              return (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">{offset + index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link
                      to={`/pegawai/${p.id}`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {p.nama_lengkap}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.nip}</td>

                  {/* --- PERUBAHAN DI SINI --- */}
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    title={p.Jabatan?.nama_jabatan || ""} // Tooltip untuk nama lengkap
                  >
                    {truncateText(p.Jabatan?.nama_jabatan, 40)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {p.Golongan?.golongan_ruang || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getScheduleBadge(jadwalKP)}>
                      {typeof jadwalKP === "object"
                        ? jadwalKP.tanggal
                        : jadwalKP}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getScheduleBadge(jadwalKGB)}>
                      {typeof jadwalKGB === "object"
                        ? jadwalKGB.tanggal
                        : jadwalKGB}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === p.id ? null : p.id)
                      }
                      className="text-gray-500 hover:text-indigo-600 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeDropdown === p.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-8 top-full mt-1 w-44 bg-white rounded-lg shadow-2xl z-20 border border-gray-200"
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              onEdit(p);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit size={16} className="mr-3 text-gray-500" />{" "}
                            Edit Detail
                          </button>
                          <button
                            onClick={() => {
                              onDelete(p);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-3" /> Hapus Pegawai
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-16 px-4">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Users size={48} className="mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Data Pegawai Tidak Ditemukan
                  </h3>
                  <p className="mt-1">
                    Silakan ubah filter atau tambahkan data pegawai baru.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PegawaiTable;
