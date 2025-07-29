/* eslint-disable no-unused-vars */
// src/components/pengaturan/GolonganSection.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  getGolongan,
  createGolongan,
  updateGolongan,
  deleteGolongan,
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
import FormGolongan from "./FormGolongan";
import Pagination from "../common/Pagination"; // Pastikan Anda mengimpor Pagination

const ITEMS_PER_PAGE = 4;

const GolonganSection = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
      const res = await getGolongan();
      setList(res.data.data || []);
    } catch (error) {
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
        await updateGolongan(selected.id, data);
        showNotification("Data golongan berhasil diperbarui.");
      } else {
        await createGolongan(data);
        showNotification("Data golongan berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan data.", "error");
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteGolongan(selected.id);
      showNotification("Data golongan berhasil dihapus.");
      setDeleteModalOpen(false);
      const totalPagesAfterDelete = Math.ceil(
        (list.length - 1) / ITEMS_PER_PAGE
      );
      if (currentPage > totalPagesAfterDelete) {
        setCurrentPage(totalPagesAfterDelete || 1);
      }
      fetchData();
    } catch (error) {
      // --- PERBAIKAN DI SINI ---
      // Mengganti alert() dengan notifikasi yang lebih baik
      setDeleteModalOpen(false); // Tutup modal konfirmasi
      showNotification(
        error.response?.data?.message || "Gagal menghapus data.",
        "error"
      );
    }
  };

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paginatedData = list.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Manajemen Golongan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data pangkat dan golongan untuk pegawai.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <PlusCircle size={20} /> Tambah Golongan
        </button>
      </div>

      <div className="h-16 mb-4">
        {notification.show && (
          <div
            className={`flex items-center p-4 rounded-lg text-white font-medium shadow-md transition-opacity duration-300 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="mr-3 shrink-0" size={20} />
            ) : (
              <XCircle className="mr-3 shrink-0" size={20} />
            )}
            {notification.message}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Golongan/Ruang
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nama Pangkat
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {g.golongan_ruang}
                      </td>
                      <td className="px-6 py-4">{g.nama_pangkat}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(g)}
                            className="text-gray-400 hover:text-indigo-600"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(g)}
                            className="text-gray-400 hover:text-red-600"
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
                    <td colSpan="3" className="text-center py-16 px-4">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Inbox size={48} className="mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-gray-700">
                          Data Tidak Ditemukan
                        </h3>
                        <p className="mt-1">
                          Belum ada data golongan yang ditambahkan.
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

      {list.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={list.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Golongan" : "Tambah Golongan Baru"}
      >
        <FormGolongan
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={isEditing ? selected : null}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Konfirmasi Penghapusan"
        message={`Yakin ingin menghapus golongan "${selected?.golongan_ruang}"?`}
      />
    </div>
  );
};

export default GolonganSection;
