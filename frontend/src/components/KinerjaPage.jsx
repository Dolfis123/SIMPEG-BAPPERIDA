/* eslint-disable no-unused-vars */
// src/pages/KinerjaPage.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  getAllKinerja,
  addKinerja,
  updateKinerja,
  deleteKinerja,
} from "../api/kinerjaService";
import {
  PlusCircle,
  Loader2,
  Search,
  Inbox,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import FormSkp from "../components/kinerja/FormSkp";
import KinerjaPegawaiCard from "../components/kinerja/KinerjaPegawaiCard";
import Pagination from "../components/common/Pagination"; // Komponen paginasi baru

const KinerjaPage = () => {
  const [kinerjaList, setKinerjaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedKinerja, setSelectedKinerja] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // Menampilkan 6 kartu per halaman

  // --- Sistem Notifikasi ---
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const notificationTimer = useRef(null);

  const showNotification = (message, type = "success") => {
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    setNotification({ show: true, message, type });
    notificationTimer.current = setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (notificationTimer.current) clearTimeout(notificationTimer.current);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllKinerja();
      setKinerjaList(response.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data kinerja:", error);
      showNotification("Gagal memuat data dari server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupedAndFilteredKinerja = useMemo(() => {
    const grouped = kinerjaList.reduce((acc, current) => {
      if (current.Pegawai && current.Pegawai.nip) {
        const pegawaiId = current.Pegawai.nip;
        if (!acc[pegawaiId]) {
          acc[pegawaiId] = {
            nama_lengkap: current.Pegawai.nama_lengkap,
            nip: current.Pegawai.nip,
            kinerja: [],
          };
        }
        acc[pegawaiId].kinerja.push(current);
      }
      return acc;
    }, {});

    return Object.values(grouped).filter(
      (pegawai) =>
        pegawai.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pegawai.nip.includes(searchTerm)
    );
  }, [kinerjaList, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalItems = groupedAndFilteredKinerja.length;
  const paginatedData = useMemo(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    return groupedAndFilteredKinerja.slice(offset, offset + ITEMS_PER_PAGE);
  }, [currentPage, groupedAndFilteredKinerja]);

  // --- Event Handlers (dengan notifikasi) ---
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedKinerja(null);
    setModalOpen(true);
  };
  const handleOpenEditModal = (kinerja) => {
    setIsEditing(true);
    setSelectedKinerja(kinerja);
    setModalOpen(true);
  };
  const handleOpenDeleteModal = (kinerja) => {
    setSelectedKinerja(kinerja);
    setDeleteModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (isEditing) {
        await updateKinerja(selectedKinerja.id, data);
        showNotification("Catatan SKP berhasil diperbarui.");
      } else {
        await addKinerja(data);
        showNotification("Catatan SKP baru berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal menyimpan data SKP.";
      showNotification(errorMessage, "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedKinerja) return;
    try {
      await deleteKinerja(selectedKinerja.id);
      showNotification("Catatan SKP berhasil dihapus.");
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      showNotification("Gagal menghapus data SKP.", "error");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* --- Header & Tombol Aksi --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manajemen Kinerja (SKP)
            </h1>
            <p className="text-base text-gray-600 mt-1">
              Kelola riwayat penilaian kinerja untuk semua pegawai.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <PlusCircle size={20} />
            Tambah SKP
          </button>
        </div>

        {/* --- Notifikasi --- */}
        <div className="h-16 mb-4">
          {notification.show && (
            <div
              className={`flex items-center p-4 rounded-lg text-white font-medium shadow-md transition-opacity duration-300 ease-in-out ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
              role="alert"
            >
              {notification.type === "success" ? (
                <CheckCircle className="mr-3 flex-shrink-0" size={20} />
              ) : (
                <XCircle className="mr-3 flex-shrink-0" size={20} />
              )}
              {notification.message}
            </div>
          )}
        </div>

        {/* --- Search Bar --- */}
        <div className="relative mb-8">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari pegawai berdasarkan nama atau NIP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
          />
        </div>

        {/* --- Konten Utama --- */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-lg font-medium text-gray-600">
              Memuat Data Kinerja...
            </p>
          </div>
        ) : totalItems > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedData.map((pegawai) => (
                <KinerjaPegawaiCard
                  key={pegawai.nip}
                  pegawai={pegawai}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          // --- Tampilan Data Kosong ---
          <div className="text-center py-16 px-4 bg-white rounded-xl shadow border">
            <Inbox size={56} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              {searchTerm ? "Pegawai Tidak Ditemukan" : "Belum Ada Data"}
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm
                ? "Coba kata kunci lain atau periksa kembali nama/NIP."
                : "Silakan tambahkan data kinerja pegawai untuk memulai."}
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Catatan SKP" : "Tambah Catatan SKP"}
      >
        <FormSkp
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={isEditing ? selectedKinerja : null}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        message={
          selectedKinerja
            ? `Yakin ingin menghapus SKP untuk ${selectedKinerja.Pegawai?.nama_lengkap} tahun ${selectedKinerja.tahun_penilaian}?`
            : "Yakin ingin menghapus data ini?"
        }
      />
    </div>
  );
};

export default KinerjaPage;
