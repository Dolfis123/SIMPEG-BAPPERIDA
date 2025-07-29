/* eslint-disable no-unused-vars */
// src/pages/UsulanListPage.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { getAllUsulan, updateStatusUsulan } from "../api/usulanService";
import {
  Loader2,
  PlusCircle,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import Modal from "../components/common/Modal";
import FormBuatUsulan from "../components/FormBuatUsulan";
import ConfirmModal from "../components/common/ConfirmModal";
import Pagination from "../components/common/Pagination";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const StatusBadge = ({ status }) => {
  const baseStyle = "text-xs font-semibold px-3 py-1 rounded-full inline-block";
  let colorStyle = "bg-gray-100 text-gray-800"; // Default (Draft)
  switch (status) {
    case "Diajukan":
      colorStyle = "bg-blue-100 text-blue-800";
      break;
    case "Disetujui":
      colorStyle = "bg-emerald-100 text-emerald-800";
      break;
    case "Ditolak":
      colorStyle = "bg-red-100 text-red-800";
      break;
  }
  return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
};

const UsulanListPage = () => {
  const [allUsulan, setAllUsulan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedUsulanId, setSelectedUsulanId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
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
      const data = await getAllUsulan();
      setAllUsulan(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      showNotification("Gagal memuat data dari server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsulan = useMemo(() => {
    return allUsulan
      .filter(
        (usulan) =>
          filterStatus === "Semua" || usulan.status_usulan === filterStatus
      )
      .filter((usulan) => {
        const nama = usulan.Pegawai?.nama_lengkap?.toLowerCase() || "";
        const jenis = usulan.jenis_usulan?.toLowerCase() || "";
        return (
          nama.includes(searchTerm.toLowerCase()) ||
          jenis.includes(searchTerm.toLowerCase())
        );
      });
  }, [filterStatus, allUsulan, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageData = filteredUsulan.slice(offset, offset + ITEMS_PER_PAGE);

  const handleOpenAjukanConfirm = (usulanId) => {
    setSelectedUsulanId(usulanId);
    setConfirmModalOpen(true);
  };

  const handleConfirmAjukan = async () => {
    if (!selectedUsulanId) return;
    try {
      await updateStatusUsulan(selectedUsulanId, { status_usulan: "Diajukan" });
      showNotification("Usulan berhasil diajukan.");
      fetchData();
    } catch (error) {
      showNotification("Gagal mengajukan usulan.", "error");
    } finally {
      setConfirmModalOpen(false);
      setSelectedUsulanId(null);
    }
  };

  // Opsi untuk tombol filter
  const statusFilters = ["Semua", "Draft", "Diajukan", "Disetujui", "Ditolak"];

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proses Usulan</h1>
            <p className="text-base text-gray-600 mt-1">
              Kelola semua usulan Kenaikan Pangkat dan Gaji Berkala.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <PlusCircle size={20} />
            Buat Usulan Baru
          </button>
        </div>

        <div className="h-16 mb-4">
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

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* --- Filter Bar yang Didesain Ulang --- */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative md:w-1/2 lg:w-1/3">
                <Search
                  size={20}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cari nama atau jenis usulan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                      filterStatus === status
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              <p className="mt-3 text-lg font-medium text-gray-600">
                Memuat Data Usulan...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nama Pegawai</th>
                    <th className="px-6 py-4">Jenis Usulan</th>
                    <th className="px-6 py-4">Tanggal Dibuat</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPageData.length > 0 ? (
                    currentPageData.map((usulan) => (
                      <tr
                        key={usulan.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-medium text-gray-900">
                            {usulan.Pegawai?.nama_lengkap || "N/A"}
                          </p>
                          <p className="text-gray-500">
                            {usulan.Pegawai?.nip || ""}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {usulan.jenis_usulan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {new Date(usulan.createdAt).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={usulan.status_usulan} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            {usulan.status_usulan === "Draft" && (
                              <button
                                onClick={() =>
                                  handleOpenAjukanConfirm(usulan.id)
                                }
                                title="Ajukan Usulan"
                                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                              >
                                <Send size={18} />
                              </button>
                            )}
                            <Link
                              to={`/usulan/${usulan.id}`}
                              className="px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
                            >
                              Detail
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-16 px-4">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Inbox size={48} className="mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold text-gray-700">
                            Tidak Ada Usulan Ditemukan
                          </h3>
                          <p className="mt-1">
                            Coba ubah filter atau buat usulan baru.
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

        {!loading && filteredUsulan.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsulan.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Buat Usulan Baru"
      >
        <FormBuatUsulan
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            showNotification("Usulan baru berhasil dibuat.");
            fetchData();
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAjukan}
        title="Konfirmasi Pengajuan"
        message="Apakah Anda yakin ingin mengajukan usulan ini ke verifikator? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};

export default UsulanListPage;
