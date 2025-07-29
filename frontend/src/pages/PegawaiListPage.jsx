/* eslint-disable no-unused-vars */
// src/pages/PegawaiListPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import FormTambahPegawai from "../components/FormTambahPegawai";
import FormEditPegawai from "../components/FormEditPegawai";
import PegawaiTable from "../components/PegawaiTable";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import { getAllPegawai, deletePegawai } from "../api/pegawaiService";
import { getUnitKerja } from "../api/masterDataService";

const ITEMS_PER_PAGE = 15;

const PegawaiListPage = () => {
  // State untuk mengontrol modal
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);

  // State untuk data
  const [allPegawai, setAllPegawai] = useState([]);
  const [unitKerjaList, setUnitKerjaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State untuk fungsionalitas
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnitKerja, setFilterUnitKerja] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [pegawaiData, unitKerjaRes] = await Promise.all([
        getAllPegawai(),
        getUnitKerja(),
      ]);
      setAllPegawai(pegawaiData);
      setUnitKerjaList(unitKerjaRes.data.data);
    } catch (error) {
      setError("Gagal memuat data. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logika untuk memfilter data
  const filteredPegawai = useMemo(() => {
    let results = allPegawai;
    if (searchTerm) {
      results = results.filter(
        (pegawai) =>
          pegawai.nama_lengkap
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          pegawai.nip.includes(searchTerm)
      );
    }
    if (filterUnitKerja !== "semua") {
      results = results.filter(
        (pegawai) => pegawai.id_unit_kerja == filterUnitKerja
      );
    }
    return results;
  }, [searchTerm, filterUnitKerja, allPegawai]);

  // Efek untuk mereset halaman saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterUnitKerja]);

  // Handler untuk membuka modal
  const handleEdit = (pegawai) => {
    setSelectedPegawai(pegawai);
    setEditModalOpen(true);
  };

  const handleDelete = (pegawai) => {
    setSelectedPegawai(pegawai);
    setDeleteModalOpen(true);
  };

  // Handler untuk konfirmasi hapus
  const handleConfirmDelete = async () => {
    if (!selectedPegawai) return;
    try {
      await deletePegawai(selectedPegawai.id);
      alert("Pegawai berhasil dihapus.");
      setDeleteModalOpen(false);
      setSelectedPegawai(null);
      fetchData(); // Muat ulang data setelah berhasil hapus
    } catch (error) {
      alert("Gagal menghapus pegawai.");
      setDeleteModalOpen(false);
    }
  };

  // Logika Paginasi
  const totalPages = Math.ceil(filteredPegawai.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageData = filteredPegawai.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Manajemen Pegawai
          </h1>
          <p className="text-slate-500 mt-1">
            Kelola data pegawai di lingkungan Bapperida.
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          Tambah Pegawai
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari pegawai (nama/NIP)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
          <div className="flex-grow">
            <select
              value={filterUnitKerja}
              onChange={(e) => setFilterUnitKerja(e.target.value)}
              className="input-style w-full"
            >
              <option value="semua">Semua Unit Kerja</option>
              {unitKerjaList.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.nama_unit_kerja}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="animate-spin mr-2" /> Memuat data...
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-600">{error}</div>
        ) : (
          <>
            <PegawaiTable
              pegawai={currentPageData}
              offset={offset}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-slate-600">
                Menampilkan {offset + 1}-{offset + currentPageData.length} dari{" "}
                {filteredPegawai.length} data
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
                  Halaman {currentPage} dari {totalPages || 1}
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
          </>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Tambah Pegawai Baru"
      >
        <FormTambahPegawai
          onClose={() => setAddModalOpen(false)}
          onSuccess={fetchData}
        />
      </Modal>

      {selectedPegawai && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Data: ${selectedPegawai.nama_lengkap}`}
        >
          <FormEditPegawai
            onClose={() => setEditModalOpen(false)}
            onSuccess={fetchData}
            initialData={selectedPegawai}
          />
        </Modal>
      )}

      {selectedPegawai && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Konfirmasi Hapus"
          message={`Apakah Anda yakin ingin menghapus data pegawai ${selectedPegawai.nama_lengkap}? Tindakan ini tidak dapat dibatalkan.`}
        />
      )}
    </div>
  );
};

export default PegawaiListPage;
