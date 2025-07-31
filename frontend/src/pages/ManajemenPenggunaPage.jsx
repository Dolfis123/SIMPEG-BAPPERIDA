/* eslint-disable no-unused-vars */
// src/pages/ManajemenPenggunaPage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userService";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";
import UserTable from "../components/pengguna/UserTable"; // <-- Impor komponen tabel
import FormPengguna from "../components/pengguna/FormPengguna"; // <-- Impor komponen form

const ManajemenPenggunaPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const notificationTimer = useRef(null);
  const ITEMS_PER_PAGE = 10;

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
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      showNotification("Gagal memuat data pengguna.", "error");
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
    setSelectedUser(null);
    setModalOpen(true);
  };
  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setModalOpen(true);
  };
  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (isEditing) {
        await updateUser(selectedUser.id, data);
        showNotification("Data pengguna berhasil diperbarui.");
      } else {
        await createUser(data);
        showNotification("Pengguna baru berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan data.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      showNotification("Pengguna berhasil dihapus.");
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus data.", "error");
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Pengguna
          </h1>
          <p className="text-base text-gray-600 mt-1">
            Kelola akun dan hak akses untuk pengguna sistem.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <PlusCircle size={20} /> Tambah Pengguna
        </button>
      </div>

      <div className="h-16">
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

      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {loading ? (
          <div className="text-center py-20">
            <Loader2
              className="animate-spin mx-auto text-indigo-500"
              size={32}
            />
          </div>
        ) : (
          <UserTable
            users={paginatedUsers}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            currentUser={currentUser}
          />
        )}
      </div>

      {users.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
      >
        <FormPengguna
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={selectedUser}
          isEditing={isEditing}
        />
      </Modal>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Yakin ingin menghapus pengguna "${selectedUser?.username}"?`}
      />
    </div>
  );
};

export default ManajemenPenggunaPage;
