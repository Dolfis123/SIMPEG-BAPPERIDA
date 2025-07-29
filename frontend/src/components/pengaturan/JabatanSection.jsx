/* eslint-disable no-unused-vars */
// src/components/pengaturan/JabatanSection.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  getJabatan,
  createJabatan,
  updateJabatan,
  deleteJabatan,
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
import FormJabatan from "./FormJabatan";
import Pagination from "../common/Pagination";

const ITEMS_PER_PAGE = 5; // Jumlah item per halaman

const JabatanSection = () => {
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
    notificationTimer.current = setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getJabatan();
      setList(res.data.data || []);
    } catch (error) {
      showNotification("Gagal memuat data dari server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (notificationTimer.current) clearTimeout(notificationTimer.current);
    };
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
        await updateJabatan(selected.id, data);
        showNotification("Data jabatan berhasil diperbarui.");
      } else {
        await createJabatan(data);
        showNotification("Data jabatan berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Gagal menyimpan data.",
        "error"
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteJabatan(selected.id);
      showNotification("Data jabatan berhasil dihapus.");
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Gagal menghapus data.",
        "error"
      );
    }
  };

  const paginatedData = list.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Manajemen Jabatan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data jabatan struktural dan fungsional.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <PlusCircle size={20} /> Tambah Jabatan
        </button>
      </div>

      <div className="h-16 mb-4">
        {notification.show && (
          <div
            className={`flex items-center p-4 rounded-lg text-white font-medium shadow-md ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} className="mr-3" />
            ) : (
              <XCircle size={20} className="mr-3" />
            )}
            {notification.message}
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Nama Jabatan</th>
                <th className="px-6 py-3">Jenis</th>
                <th className="px-6 py-3">Eselon</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-indigo-500" />
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {j.nama_jabatan}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {j.jenis_jabatan}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono">
                      {j.eselon || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(j)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(j)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16 px-4">
                    <div className="flex flex-col items-center text-gray-500">
                      <Inbox size={48} className="mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-gray-700">
                        Belum Ada Data Jabatan
                      </h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
        title={isEditing ? "Edit Jabatan" : "Tambah Jabatan Baru"}
      >
        <FormJabatan
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={isEditing ? selected : null}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Yakin ingin menghapus jabatan "${selected?.nama_jabatan}"?`}
      />
    </div>
  );
};

export default JabatanSection;
