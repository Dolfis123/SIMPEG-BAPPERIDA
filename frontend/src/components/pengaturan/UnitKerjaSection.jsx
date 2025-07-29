// src/components/pengaturan/UnitKerjaSection.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  getUnitKerja,
  createUnitKerja,
  updateUnitKerja,
  deleteUnitKerja,
} from "../../api/masterDataService";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  Inbox,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Modal from "../common/Modal";
import ConfirmModal from "../common/ConfirmModal";
import FormUnitKerja from "./FormUnitKerja";

// Mengatur 4 item per halaman
const ITEMS_PER_PAGE = 4;

const UnitKerjaSection = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // State & Ref untuk Notifikasi
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const notificationTimer = useRef(null);

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type = "success") => {
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    setNotification({ show: true, message, type });
    notificationTimer.current = setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Efek untuk membersihkan timer saat komponen unmount
  useEffect(() => {
    return () => {
      if (notificationTimer.current) clearTimeout(notificationTimer.current);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUnitKerja();
      setList(res.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data unit kerja:", error);
      showNotification("Gagal memuat data dari server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelected(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setSelected(item);
    setModalOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelected(item);
    setDeleteModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (isEditing) {
        await updateUnitKerja(selected.id, data);
        showNotification("Data unit kerja berhasil diperbarui.");
      } else {
        await createUnitKerja(data);
        showNotification("Data unit kerja berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      showNotification("Gagal menyimpan data. Coba lagi.", "error");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteUnitKerja(selected.id);
      showNotification("Data unit kerja berhasil dihapus.");
      setDeleteModalOpen(false);
      const totalPagesAfterDelete = Math.ceil(
        (list.length - 1) / ITEMS_PER_PAGE
      );
      if (currentPage > totalPagesAfterDelete) {
        setCurrentPage(totalPagesAfterDelete || 1);
      }
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert(error.toString());
      // showNotification(
      //   error.response?.data?.message || "Gagal menghapus data.",
    }
  };

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paginatedData = list.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg transition-all duration-300">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Manajemen Unit Kerja
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola hierarki dan daftar unit kerja.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <PlusCircle size={20} />
          Tambah Unit Kerja
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

      {/* --- Konten Utama: Loading atau Tabel --- */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <span className="text-gray-500">Memuat data...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nama Unit Kerja
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Induk
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((u) => (
                    <tr
                      key={u.id}
                      className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {u.nama_unit_kerja}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {list.find((parent) => parent.id === u.id_induk)
                          ?.nama_unit_kerja || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(u)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                        <Inbox size={48} className="text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">
                          Data Tidak Ditemukan
                        </h3>
                        <p className="text-gray-500 mt-1">
                          Belum ada data unit kerja yang ditambahkan.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Paginasi dengan Nomor Halaman --- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <span className="text-sm text-gray-700">
            Menampilkan{" "}
            <span className="font-semibold">{paginatedData.length}</span> dari{" "}
            <span className="font-semibold">{list.length}</span> data
          </span>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm font-medium border rounded-md shadow-sm transition-colors ${
                  currentPage === page
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya
            </button>
          </nav>
        </div>
      )}

      {/* --- Modal dan Konfirmasi --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Unit Kerja" : "Tambah Unit Kerja Baru"}
      >
        <FormUnitKerja
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={isEditing ? selected : null}
          unitKerjaList={list}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Konfirmasi Penghapusan"
        message={`Apakah Anda yakin ingin menghapus unit kerja "${selected?.nama_unit_kerja}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
};

export default UnitKerjaSection;
