// src/pages/LaporanPage.jsx
import React, { useState, useEffect } from "react";
import { getDUKData } from "../api/laporanService";
import { Loader2, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import DukTable from "../components/laporan/DukTable"; // Menggunakan komponen tabel yang sudah dipisah

const ITEMS_PER_PAGE = 10; // Menampilkan 10 data per halaman

const LaporanPage = () => {
  const [dukData, setDukData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State untuk paginasi

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDUKData();
        setDukData(data);
      } catch (error) {
        console.error("Gagal memuat data DUK:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Logika Paginasi ---
  const totalPages = Math.ceil(dukData.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageData = dukData.slice(offset, offset + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Fungsi Ekspor (tetap menggunakan data lengkap 'dukData') ---
  const handleExportExcel = () => {
    const tableData = dukData.map((p, index) => ({
      No: index + 1,
      "Nama Lengkap": p.nama_lengkap,
      NIP: p.nip,
      "Pangkat/Golongan": `${p.Golongan?.nama_pangkat} (${p.Golongan?.golongan_ruang})`,
      Jabatan: p.Jabatan?.nama_jabatan,
      "TMT Pangkat": new Date(p.tmt_pangkat_terakhir).toLocaleDateString(
        "id-ID"
      ),
    }));
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DUK Pegawai");
    XLSX.writeFile(workbook, "Laporan_DUK_Pegawai.xlsx");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Daftar Urut Kepangkatan (DUK) Pegawai", 14, 16);
    autoTable(doc, {
      head: [["No", "Nama Lengkap", "NIP", "Pangkat/Golongan", "Jabatan"]],
      body: dukData.map((p, index) => [
        index + 1,
        p.nama_lengkap,
        p.nip,
        `${p.Golongan?.nama_pangkat} (${p.Golongan?.golongan_ruang})`,
        p.Jabatan?.nama_jabatan,
      ]),
      startY: 24,
    });
    doc.save("Laporan_DUK_Pegawai.pdf");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Laporan Kepegawaian
          </h1>
          <p className="text-slate-500 mt-1">
            Hasilkan laporan resmi kepegawaian.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            <Printer size={20} className="mr-2" /> Ekspor Excel
          </button>
          <button
            onClick={handleExportPdf}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
          >
            <Printer size={20} className="mr-2" /> Ekspor PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-slate-700 mb-4">
          Daftar Urut Kepangkatan (DUK)
        </h2>
        {loading ? (
          <div className="text-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            <DukTable data={currentPageData} offset={offset} />
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-slate-600">
                  Menampilkan {offset + 1}-{offset + currentPageData.length}{" "}
                  dari {dukData.length} data
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-3 py-1 font-medium">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LaporanPage;
