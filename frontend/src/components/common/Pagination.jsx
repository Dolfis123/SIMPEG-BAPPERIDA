// src/components/common/Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // Tidak perlu menampilkan paginasi jika hanya ada satu halaman
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <span className="text-sm text-gray-700 mb-4 sm:mb-0">
        Menampilkan data pada halaman{" "}
        <span className="font-semibold">{currentPage}</span> dari{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span>Sebelumnya</span>
        </button>

        {/* Tombol nomor halaman */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 text-sm font-medium border rounded-md shadow-sm transition-colors hidden sm:inline-block ${
              currentPage === page
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <span>Berikutnya</span>
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
