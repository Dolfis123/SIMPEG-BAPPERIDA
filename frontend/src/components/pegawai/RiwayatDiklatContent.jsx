/* eslint-disable no-unused-vars */
// src/components/pegawai/RiwayatDiklatContent.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  getDiklatByPegawaiId,
  createDiklat,
  updateDiklat,
  deleteDiklat,
} from "../../api/riwayatDiklatService";
import {
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  Inbox,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";
import Modal from "../common/Modal";
import ConfirmModal from "../common/ConfirmModal";

// --- Form untuk Tambah/Edit Riwayat Diklat ---
const FormDiklat = ({ onSave, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    nama_diklat: "",
    penyelenggara: "",
    tahun_diklat: "",
    jumlah_jam: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Diklat
        </label>
        <input
          type="text"
          name="nama_diklat"
          value={formData.nama_diklat}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Penyelenggara
        </label>
        <input
          type="text"
          name="penyelenggara"
          value={formData.penyelenggara}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tahun Diklat
        </label>
        <input
          type="text"
          name="tahun_diklat"
          value={formData.tahun_diklat}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jumlah Jam Pelajaran (JP)
        </label>
        <input
          type="number"
          name="jumlah_jam"
          value={formData.jumlah_jam}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

const RiwayatDiklatContent = ({ pegawaiId }) => {
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
      const data = await getDiklatByPegawaiId(pegawaiId);
      setRiwayatList(data);
    } catch (error) {
      showNotification("Gagal memuat riwayat diklat.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (notificationTimer.current) clearTimeout(notificationTimer.current);
    };
  }, [pegawaiId]);

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
        await updateDiklat(selected.id, data);
        showNotification("Riwayat diklat berhasil diperbarui.");
      } else {
        await createDiklat(pegawaiId, data);
        showNotification("Riwayat diklat berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      showNotification(error.message || "Gagal menyimpan data.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDiklat(selected.id);
      showNotification("Riwayat diklat berhasil dihapus.");
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      showNotification(error.message || "Gagal menghapus data.", "error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-16">
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
      <div className="flex justify-end">
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <PlusCircle size={16} /> Tambah Riwayat
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Nama Diklat</th>
              <th className="px-6 py-3">Penyelenggara</th>
              <th className="px-6 py-3">Tahun</th>
              <th className="px-6 py-3">Jam (JP)</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto text-indigo-500" />
                </td>
              </tr>
            ) : riwayatList.length > 0 ? (
              riwayatList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.nama_diklat}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.penyelenggara}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.tahun_diklat}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.jumlah_jam}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(item)}
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
                <td colSpan="5" className="text-center py-16 px-4">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Award size={48} className="mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      Belum Ada Riwayat Diklat
                    </h3>
                    <p className="mt-1">
                      Silakan tambahkan data riwayat diklat pertama.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Riwayat Diklat" : "Tambah Riwayat Diklat"}
      >
        <FormDiklat
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={selected}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus data riwayat diklat ini?"
      />
    </div>
  );
};

export default RiwayatDiklatContent;
