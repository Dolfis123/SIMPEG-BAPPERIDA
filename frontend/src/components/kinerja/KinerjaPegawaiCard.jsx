// src/components/kinerja/KinerjaPegawaiCard.jsx
import React, { useState, useMemo } from "react";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  BarChart3,
} from "lucide-react";

// Fungsi helper untuk mendapatkan inisial dari nama
const getInitials = (name) => {
  if (!name) return "??";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.slice(0, 2).toUpperCase();
};

// Fungsi helper untuk badge predikat berwarna
const getPredikatBadge = (predikat) => {
  const baseClasses =
    "text-xs font-semibold px-2.5 py-1 rounded-full inline-block";
  switch (predikat?.toLowerCase()) {
    case "sangat baik":
      return `bg-emerald-100 text-emerald-800 ${baseClasses}`;
    case "baik":
      return `bg-sky-100 text-sky-800 ${baseClasses}`;
    case "cukup":
      return `bg-amber-100 text-amber-800 ${baseClasses}`;
    case "kurang":
      return `bg-red-100 text-red-800 ${baseClasses}`;
    default:
      return `bg-gray-100 text-gray-800 ${baseClasses}`;
  }
};

const KinerjaPegawaiCard = ({ pegawai, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const paginatedKinerja = useMemo(() => {
    const sortedKinerja = [...pegawai.kinerja].sort(
      (a, b) => b.tahun_penilaian - a.tahun_penilaian
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedKinerja.slice(startIndex, startIndex + itemsPerPage);
  }, [pegawai.kinerja, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(pegawai.kinerja.length / itemsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* --- Card Header dengan Avatar --- */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
          {getInitials(pegawai.nama_lengkap)}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-semibold text-lg text-gray-800 truncate">
            {pegawai.nama_lengkap}
          </h3>
          <p className="text-sm text-gray-500">NIP: {pegawai.nip}</p>
        </div>
      </div>

      {/* --- Konten Kinerja --- */}
      <div className="p-4 flex-grow flex flex-col">
        {pegawai.kinerja.length > 0 ? (
          <>
            <div className="flex-grow">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 font-semibold text-gray-500">Tahun</th>
                    <th className="pb-2 font-semibold text-gray-500">
                      Predikat
                    </th>
                    <th className="pb-2 font-semibold text-gray-500 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedKinerja.map((k) => (
                    <tr
                      key={k.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-2.5 text-gray-700">
                        {k.tahun_penilaian}
                      </td>
                      <td className="py-2.5">
                        <span className={getPredikatBadge(k.predikat_kinerja)}>
                          {k.predikat_kinerja || "N/A"}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => onEdit(k)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(k)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- Paginasi Internal Kartu --- */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <span className="text-xs text-gray-600 font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-full hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            )}
          </>
        ) : (
          // --- Tampilan Jika Kinerja Kosong ---
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 text-gray-500">
            <BarChart3 size={32} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">Belum ada data SKP.</span>
            <span className="text-xs mt-1">
              Tambahkan melalui tombol di atas.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KinerjaPegawaiCard;
