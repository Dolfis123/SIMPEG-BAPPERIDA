/* eslint-disable no-unused-vars */
// src/components/pegawai/TabDokumen.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  getDokumenByPegawaiId,
  uploadDokumen,
  updateDokumen,
  deleteDokumen,
  replaceDokumen,
} from "../../api/dokumenService";
import {
  Loader2,
  UploadCloud,
  FileText,
  Trash2,
  Edit,
  Search,
  Replace,
  Inbox,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Modal from "../common/Modal";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";

const ITEMS_PER_PAGE = 4;

// --- Sub-komponen Form untuk kerapian kode ---

const FormEditKategori = ({ initialKategori, onSave, onClose }) => {
  const [kategori, setKategori] = useState(initialKategori);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(kategori);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="kategori_edit"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Ubah Kategori Dokumen
        </label>
        <select
          id="kategori_edit"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option>SK Pangkat</option>
          <option>SK Jabatan</option>
          <option>SK KGB</option>
          <option>Ijazah</option>
          <option>Sertifikat</option>
          <option>Lainnya</option>
        </select>
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

const FormReplaceFile = ({ onSave, onClose }) => {
  const [newFile, setNewFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newFile) return;
    setIsSubmitting(true);
    await onSave(newFile);
    setIsSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="file-replace"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Pilih File Pengganti (.pdf, .jpg, .png)
        </label>
        <input
          id="file-replace"
          type="file"
          onChange={(e) => setNewFile(e.target.files[0])}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          required
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="animate-spin mr-2" size={16} />}
          {isSubmitting ? "Mengunggah..." : "Unggah & Ganti"}
        </button>
      </div>
    </form>
  );
};

const TabDokumen = ({ pegawaiId }) => {
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [kategori, setKategori] = useState("SK Pangkat");
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDokumen, setSelectedDokumen] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isReplaceModalOpen, setReplaceModalOpen] = useState(false);
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

  const fetchDokumen = async () => {
    try {
      setLoading(true);
      const data = await getDokumenByPegawaiId(pegawaiId);
      setDokumenList(data);
    } catch (error) {
      showNotification("Gagal memuat data dokumen.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pegawaiId) fetchDokumen();
  }, [pegawaiId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotification("Silakan pilih file terlebih dahulu.", "error");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pegawai_id", pegawaiId);
    formData.append("kategori_dokumen", kategori);
    try {
      await uploadDokumen(formData);
      showNotification("Dokumen berhasil diunggah.");
      setFile(null);
      if (document.getElementById("file-upload"))
        document.getElementById("file-upload").value = "";
      fetchDokumen();
    } catch (error) {
      showNotification(error.message || "Gagal mengunggah dokumen.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDokumen = useMemo(() => {
    return dokumenList.filter(
      (doc) =>
        doc.nama_file.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.kategori_dokumen.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dokumenList]);

  const paginatedDokumen = useMemo(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDokumen.slice(offset, offset + ITEMS_PER_PAGE);
  }, [filteredDokumen, currentPage]);

  const handleOpenEdit = (doc) => {
    setSelectedDokumen(doc);
    setEditModalOpen(true);
  };
  const handleOpenDelete = (doc) => {
    setSelectedDokumen(doc);
    setDeleteModalOpen(true);
  };
  const handleOpenReplace = (doc) => {
    setSelectedDokumen(doc);
    setReplaceModalOpen(true);
  };

  const handleUpdateKategori = async (newKategori) => {
    try {
      await updateDokumen(selectedDokumen.id, {
        kategori_dokumen: newKategori,
      });
      showNotification("Kategori berhasil diperbarui.");
      setEditModalOpen(false);
      fetchDokumen();
    } catch (error) {
      showNotification(error.message || "Gagal memperbarui kategori.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDokumen(selectedDokumen.id);
      showNotification("Dokumen berhasil dihapus.");
      setDeleteModalOpen(false);
      fetchDokumen();
    } catch (error) {
      showNotification(error.message || "Gagal menghapus dokumen.", "error");
    }
  };

  const handleConfirmReplace = async (newFile) => {
    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("pegawai_id", pegawaiId);
    formData.append("kategori_dokumen", selectedDokumen.kategori_dokumen);
    try {
      await replaceDokumen(selectedDokumen.id, formData);
      showNotification("Dokumen berhasil diganti.");
      setReplaceModalOpen(false);
      fetchDokumen();
    } catch (error) {
      showNotification(error.message || "Gagal mengganti dokumen.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="h-16">
        {notification.show && (
          <div
            className={`flex items-center p-4 rounded-lg text-white font-medium shadow-md transition-opacity duration-300 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
            role="alert"
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

      <form
        onSubmit={handleUpload}
        className="bg-gray-50 p-6 rounded-xl border border-dashed"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Unggah Dokumen Baru
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih File
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="md:col-span-1">
            <label
              htmlFor="kategori"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kategori
            </label>
            <select
              name="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>SK Pangkat</option>
              <option>SK Jabatan</option>
              <option>SK KGB</option>
              <option>Ijazah</option>
              <option>Sertifikat</option>
              <option>Lainnya</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center font-semibold"
          >
            {isUploading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <UploadCloud className="mr-2" />
            )}
            {isUploading ? "Mengunggah..." : "Unggah"}
          </button>
        </div>
      </form>

      <div className="relative">
        <Search
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Cari dokumen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="text-center p-10">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Nama Dokumen</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Tanggal Unggah</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedDokumen.length > 0 ? (
                  paginatedDokumen.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                        <FileText
                          size={18}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <a
                          href={`http://localhost:5000/${doc.path_file.replace(
                            /\\/g,
                            "/"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline truncate"
                          title={doc.nama_file}
                        >
                          {doc.nama_file}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {doc.kategori_dokumen}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(doc.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                            title="Edit Kategori"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenReplace(doc)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full"
                            title="Ganti File"
                          >
                            <Replace size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(doc)}
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
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Inbox size={48} className="mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-gray-700">
                          Belum Ada Dokumen
                        </h3>
                        <p className="mt-1">
                          Silakan unggah dokumen pertama untuk pegawai ini.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredDokumen.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredDokumen.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {selectedDokumen && (
        <>
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            title="Edit Kategori Dokumen"
          >
            <FormEditKategori
              initialKategori={selectedDokumen.kategori_dokumen}
              onSave={handleUpdateKategori}
              onClose={() => setEditModalOpen(false)}
            />
          </Modal>
          <Modal
            isOpen={isReplaceModalOpen}
            onClose={() => setReplaceModalOpen(false)}
            title={`Ganti File: ${selectedDokumen.nama_file}`}
          >
            <FormReplaceFile
              onSave={handleConfirmReplace}
              onClose={() => setReplaceModalOpen(false)}
            />
          </Modal>
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Konfirmasi Hapus Dokumen"
            message={`Yakin ingin menghapus file "${selectedDokumen.nama_file}"?`}
          />
        </>
      )}
    </div>
  );
};

export default TabDokumen;
