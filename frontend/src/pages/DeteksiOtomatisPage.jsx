import React, { useState, useMemo } from "react";
import { findPotentialCandidates } from "../api/detectionService";
import { Loader2, Zap, Inbox } from "lucide-react";
import Modal from "../components/common/Modal";
import FormBuatUsulan from "../components/FormBuatUsulan";
import Pagination from "../components/common/Pagination"; // <-- Impor paginasi
import { hitungJadwalKP, hitungJadwalKGB } from "../utils/dateHelper";

// Komponen Tabel Hasil yang Didesain Ulang
const ResultTable = ({ data, type, onBuatUsulan }) => {
  const isKP = type === "KP";

  const calculateMasaKerja = (tmt) => {
    if (!tmt) return "N/A";
    const today = new Date();
    const tmtDate = new Date(tmt);
    let years = today.getFullYear() - tmtDate.getFullYear();
    const months = today.getMonth() - tmtDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < tmtDate.getDate())) {
      years--;
    }
    return `${years} tahun`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold tracking-wider">
          <tr>
            <th className="px-6 py-3">Nama / NIP</th>
            <th className="px-6 py-3">Jabatan</th>
            <th className="px-6 py-3">TMT Terakhir</th>
            {isKP && <th className="px-6 py-3">Masa Kerja</th>}
            <th className="px-6 py-3">Prediksi Periode</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((p) => {
            const jadwal = isKP
              ? hitungJadwalKP(p.tmt_pangkat_terakhir)
              : hitungJadwalKGB(p.tmt_kgb_terakhir);

            return (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{p.nama_lengkap}</p>
                  <p className="text-gray-500">{p.nip}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {p.Jabatan?.nama_jabatan || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Date(
                    isKP ? p.tmt_pangkat_terakhir : p.tmt_kgb_terakhir
                  ).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                {isKP && (
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {calculateMasaKerja(p.tmt_pangkat_terakhir)}
                  </td>
                )}
                {/* --- PERBAIKAN DI SINI --- */}
                <td className="px-6 py-4 whitespace-nowrap text-green-700 font-semibold">
                  {jadwal.tanggal}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onBuatUsulan(p, isKP ? "KP Reguler" : "KGB")}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    Buat Usulan
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const DeteksiOtomatisPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("KP");
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialUsulanData, setInitialUsulanData] = useState(null);

  // --- State untuk Paginasi ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Sesuai permintaan Anda

  const handleDetect = async () => {
    setLoading(true);
    setError("");
    setResults(null);
    setCurrentPage(1); // Reset halaman saat deteksi baru
    try {
      const data = await findPotentialCandidates();
      setResults(data);
    } catch (err) {
      setError(err.message || "Gagal menjalankan deteksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuatUsulan = (pegawai, jenisUsulan) => {
    setInitialUsulanData({
      pegawai_id: pegawai.id,
      nama_lengkap: `${pegawai.nama_lengkap} (${pegawai.nip})`,
      jenis_usulan: jenisUsulan,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setInitialUsulanData(null);
  };

  // Logika untuk Paginasi
  const paginatedData = useMemo(() => {
    if (!results) return [];
    const dataToPaginate =
      activeTab === "KP" ? results.potentialKP : results.potentialKGB;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    return dataToPaginate.slice(offset, offset + ITEMS_PER_PAGE);
  }, [results, activeTab, currentPage]);

  const totalItems = results
    ? activeTab === "KP"
      ? results.potentialKP.length
      : results.potentialKGB.length
    : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Deteksi Otomatis
            </h1>
            <p className="text-base text-gray-600 mt-1">
              Temukan pegawai yang berpotensi untuk KP Reguler dan KGB.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <Zap size={48} className="mx-auto text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Jalankan Deteksi Sistem
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Klik tombol di bawah untuk memulai pemindaian. Sistem akan secara
            otomatis memeriksa TMT dan syarat lainnya untuk menemukan kandidat
            yang memenuhi syarat.
          </p>
          <button
            onClick={handleDetect}
            disabled={loading}
            className="mt-6 flex items-center justify-center mx-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? (
              <>
                {" "}
                <Loader2 className="animate-spin mr-2" /> Memindai...{" "}
              </>
            ) : (
              "Mulai Deteksi"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {results && (
          <div className="bg-white rounded-xl shadow-lg border mt-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px px-6">
                <button
                  onClick={() => {
                    setActiveTab("KP");
                    setCurrentPage(1);
                  }}
                  className={`py-4 px-1 font-semibold whitespace-nowrap ${
                    activeTab === "KP"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {" "}
                  Potensi KP Reguler ({results.potentialKP.length}){" "}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("KGB");
                    setCurrentPage(1);
                  }}
                  className={`ml-8 py-4 px-1 font-semibold whitespace-nowrap ${
                    activeTab === "KGB"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {" "}
                  Potensi KGB ({results.potentialKGB.length}){" "}
                </button>
              </nav>
            </div>
            <div className="p-6">
              {totalItems > 0 ? (
                <>
                  <ResultTable
                    data={paginatedData}
                    type={activeTab}
                    onBuatUsulan={handleBuatUsulan}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Inbox size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Tidak Ada Kandidat Ditemukan
                  </h3>
                  <p className="mt-1">
                    Tidak ada pegawai yang memenuhi kriteria {activeTab} saat
                    ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Buat Usulan Otomatis"
        >
          <FormBuatUsulan
            onClose={handleModalClose}
            onSuccess={() => {
              alert("Usulan berhasil dibuat dari hasil deteksi!");
              handleModalClose();
            }}
            initialData={initialUsulanData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default DeteksiOtomatisPage;
