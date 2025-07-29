/* eslint-disable no-unused-vars */
// src/pages/PegawaiDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPegawaiById, deletePegawai } from "../api/pegawaiService";
import { hitungJadwalKP, hitungJadwalKGB } from "../utils/dateHelper";
import TabDokumen from "../components/pegawai/TabDokumen";
import TabRiwayat from "../components/pegawai/TabRiwayat";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import FormEditPegawai from "../components/FormEditPegawai";
import {
  Loader2,
  ArrowLeft,
  User,
  Briefcase,
  Building,
  Mail,
  Phone,
  CalendarClock,
  Home,
  Heart,
  BookUser,
  Star,
  Calendar,
  FileText,
  Edit,
  Trash2,
  ShieldCheck,
  Award,
} from "lucide-react";

// Komponen DetailItem yang disempurnakan
const DetailItem = ({ icon, label, value, badge }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500 flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </dt>
    <dd className="mt-1 text-base text-gray-900 font-semibold pl-7">
      {badge ? badge : value || "-"}
    </dd>
  </div>
);

// Komponen TabButton
const TabButton = ({ children, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-1 py-4 font-semibold text-sm transition-colors border-b-2 ${
      isActive
        ? "border-indigo-600 text-indigo-600"
        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

// Komponen Badge Jadwal (dipindahkan ke sini agar mudah di-reuse)
const ScheduleBadge = ({ schedule }) => {
  const baseClasses =
    "text-xs font-semibold px-2.5 py-1 rounded-full inline-block whitespace-nowrap";
  const statusText = schedule.status?.toLowerCase() || "";
  let colorClass = "bg-gray-100 text-gray-700";

  if (statusText.includes("segera")) colorClass = `bg-red-100 text-red-800`;
  else if (statusText.includes("bulan lagi"))
    colorClass = `bg-amber-100 text-amber-800`;
  else if (statusText.includes("tahun lagi"))
    colorClass = `bg-emerald-100 text-emerald-800`;

  return (
    <span className={`${baseClasses} ${colorClass}`}>
      {schedule.tanggal || "-"}
    </span>
  );
};

const PegawaiDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pegawai, setPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dataDiri");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPegawaiById(id);
      setPegawai(data);
    } catch (err) {
      setError("Gagal memuat data pegawai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleConfirmDelete = async () => {
    try {
      await deletePegawai(id);
      // Ganti alert dengan navigasi dan state untuk notifikasi di halaman sebelumnya
      navigate("/pegawai", {
        state: { message: "Data pegawai berhasil dihapus." },
      });
    } catch (error) {
      alert("Gagal menghapus data pegawai.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }
  if (!pegawai) {
    return <div className="text-center p-8">Data pegawai tidak ditemukan.</div>;
  }

  // --- PERBAIKAN DI SINI ---
  // Panggil fungsi sekali untuk efisiensi
  const jadwalKP = hitungJadwalKP(pegawai.tmt_pangkat_terakhir);
  const jadwalKGB = hitungJadwalKGB(pegawai.tmt_kgb_terakhir);

  return (
    <div className="space-y-6">
      <Link
        to="/pegawai"
        className="inline-flex items-center text-indigo-600 hover:underline font-medium"
      >
        <ArrowLeft size={20} className="mr-2" />
        Kembali ke Daftar Pegawai
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-lg border flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={48} className="text-gray-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {pegawai.nama_lengkap}
            </h1>
            <p className="text-lg text-gray-600">
              {pegawai.Jabatan?.nama_jabatan || "Jabatan tidak tersedia"}
            </p>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              NIP: {pegawai.nip}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold transition-colors"
          >
            <Edit size={16} className="mr-2" /> Edit
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-semibold transition-colors"
          >
            <Trash2 size={16} className="mr-2" /> Hapus
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Status Karier
            </h2>
            <dl className="space-y-4">
              <DetailItem
                icon={<Award size={20} />}
                label="Golongan / Pangkat"
                value={`${pegawai.Golongan?.golongan_ruang} - ${pegawai.Golongan?.nama_pangkat}`}
              />
              <DetailItem
                icon={<Building size={20} />}
                label="Unit Kerja"
                value={pegawai.UnitKerja?.nama_unit_kerja}
              />
              <DetailItem
                icon={<ShieldCheck size={20} />}
                label="Status Pegawai"
                value={pegawai.status_pegawai}
              />
            </dl>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Jadwal Berikutnya
            </h2>
            <dl className="space-y-4">
              <DetailItem
                icon={<CalendarClock size={20} className="text-emerald-500" />}
                label="Prediksi KP Reguler"
                badge={<ScheduleBadge schedule={jadwalKP} />}
              />
              <DetailItem
                icon={<CalendarClock size={20} className="text-sky-500" />}
                label="Prediksi KGB"
                badge={<ScheduleBadge schedule={jadwalKGB} />}
              />
            </dl>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Kontak</h2>
            <dl className="space-y-4">
              <DetailItem
                icon={<Mail size={20} />}
                label="Email"
                value={pegawai.email}
              />
              <DetailItem
                icon={<Phone size={20} />}
                label="No. Handphone"
                value={pegawai.no_hp}
              />
            </dl>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6 px-6">
              <TabButton
                isActive={activeTab === "dataDiri"}
                onClick={() => setActiveTab("dataDiri")}
              >
                Data Diri
              </TabButton>
              <TabButton
                isActive={activeTab === "riwayat"}
                onClick={() => setActiveTab("riwayat")}
              >
                Riwayat
              </TabButton>
              <TabButton
                isActive={activeTab === "dokumen"}
                onClick={() => setActiveTab("dokumen")}
              >
                Dokumen
              </TabButton>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === "dataDiri" && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-lg text-gray-700 mb-4 pb-2 border-b">
                    Data Pribadi
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <DetailItem
                      icon={<User size={18} />}
                      label="Jenis Kelamin"
                      value={pegawai.jenis_kelamin}
                    />
                    <DetailItem
                      icon={<Star size={18} />}
                      label="Agama"
                      value={pegawai.agama}
                    />
                    <DetailItem
                      icon={<Heart size={18} />}
                      label="Status Pernikahan"
                      value={pegawai.status_pernikahan}
                    />
                    <DetailItem
                      icon={<Calendar size={18} />}
                      label="Tempat, Tanggal Lahir"
                      value={`${pegawai.tempat_lahir || ""}, ${formatDate(
                        pegawai.tanggal_lahir
                      )}`}
                    />
                    <DetailItem
                      icon={<Home size={18} />}
                      label="Alamat"
                      value={pegawai.alamat}
                    />
                  </dl>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-700 mb-4 pb-2 border-b">
                    Data Kepegawaian
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <DetailItem
                      icon={<BookUser size={18} />}
                      label="Status Kepegawaian"
                      value={pegawai.status_kepegawaian}
                    />
                    <DetailItem
                      icon={<Calendar size={18} />}
                      label="TMT CPNS"
                      value={formatDate(pegawai.tmt_cpns)}
                    />
                    <DetailItem
                      icon={<Calendar size={18} />}
                      label="TMT PNS"
                      value={formatDate(pegawai.tmt_pns)}
                    />
                    <DetailItem
                      icon={<Calendar size={18} />}
                      label="TMT Jabatan"
                      value={formatDate(pegawai.tmt_jabatan_sekarang)}
                    />
                  </dl>
                </div>
              </div>
            )}
            {activeTab === "riwayat" && <TabRiwayat pegawaiId={pegawai.id} />}
            {activeTab === "dokumen" && <TabDokumen pegawaiId={pegawai.id} />}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Data: ${pegawai.nama_lengkap}`}
      >
        <FormEditPegawai
          onClose={() => setEditModalOpen(false)}
          onSave={() => {
            setEditModalOpen(false);
            fetchData();
          }}
          initialData={pegawai}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Yakin ingin menghapus data pegawai ${pegawai.nama_lengkap}?`}
      />
    </div>
  );
};

export default PegawaiDetailPage;
