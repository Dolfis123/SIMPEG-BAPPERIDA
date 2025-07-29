/* eslint-disable no-unused-vars */
// src/pages/LaporanDukPage.jsx
import React, { useState } from "react";
import { getAllPegawai } from "../api/pegawaiService";
import { Loader2, FileSpreadsheet, Printer, Inbox } from "lucide-react";
import { differenceInYears, differenceInMonths } from "date-fns";
import { hitungJadwalKGB } from "../utils/dateHelper";

// --- Helper Functions for DUK Sorting & Display (Tidak Berubah) ---
const rankGolongan = (p) => p.Golongan?.id || 0;
const rankEselon = (p) => {
  const eselon = p.Jabatan?.eselon?.toLowerCase() || "z";
  const eselonOrder = { i: 5, ii: 4, iii: 3, iv: 2, v: 1 };
  const match = eselon.match(/([iv]+)/);
  return match ? eselonOrder[match[1]] || 0 : 0;
};
const rankPendidikan = (p) => {
  if (!p.RiwayatPendidikan || p.RiwayatPendidikan.length === 0) return 0;
  const levels = { s3: 5, s2: 4, s1: 3, d4: 3, d3: 2, sma: 1 };
  return p.RiwayatPendidikan.reduce((max, edu) => {
    const levelScore = levels[edu.tingkat_pendidikan.toLowerCase()] || 0;
    return Math.max(max, levelScore);
  }, 0);
};
const hasDiklatpim = (p) => {
  if (!p.RiwayatDiklat || p.RiwayatDiklat.length === 0) return false;
  return p.RiwayatDiklat.some(
    (d) =>
      d.nama_diklat.toLowerCase().includes("pim") ||
      d.nama_diklat.toLowerCase().includes("pkn")
  );
};
const getHighestEducationAndYear = (riwayatPendidikan) => {
  if (!riwayatPendidikan || riwayatPendidikan.length === 0)
    return { text: "-" };
  const levels = { S3: 5, S2: 4, S1: 3, D4: 3, D3: 2, SMA: 1 };
  const highestEdu = riwayatPendidikan.reduce((highest, current) => {
    const currentScore = levels[current.tingkat_pendidikan.toUpperCase()] || 0;
    const highestScore = highest
      ? levels[highest.tingkat_pendidikan.toUpperCase()] || 0
      : 0;
    return currentScore > highestScore ? current : highest;
  });
  return {
    text: `${highestEdu.tingkat_pendidikan} ${highestEdu.jurusan}`,
    tahun: highestEdu.tahun_lulus,
  };
};
const getLatestDiklat = (riwayatDiklat) => {
  if (!riwayatDiklat || riwayatDiklat.length === 0)
    return { nama: "-", tahun: "-" };
  const sortedDiklat = [...riwayatDiklat].sort(
    (a, b) => b.tahun_diklat - a.tahun_diklat
  );
  return {
    nama: sortedDiklat[0].nama_diklat,
    tahun: sortedDiklat[0].tahun_diklat,
  };
};
const calculateMasaKerja = (tmt) => {
  if (!tmt) return { tahun: "-", bulan: "-" };
  const totalBulan = differenceInMonths(new Date(), new Date(tmt));
  const tahun = Math.floor(totalBulan / 12);
  const bulan = totalBulan % 12;
  return { tahun, bulan };
};

const LaporanDukPage = () => {
  const [dukData, setDukData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportDate, setReportDate] = useState("");

  const handleGenerateDuk = async () => {
    setLoading(true);
    setError("");
    setDukData(null);
    try {
      const allPegawai = await getAllPegawai();
      const pnsAktif = allPegawai.filter(
        (p) => p.status_kepegawaian === "PNS" && p.status_pegawai === "Aktif"
      );

      pnsAktif.sort((a, b) => {
        if (rankGolongan(a) !== rankGolongan(b))
          return rankGolongan(b) - rankGolongan(a);
        if (rankEselon(a) !== rankEselon(b))
          return rankEselon(b) - rankEselon(a);
        const tmtPnsA = new Date(a.tmt_pns || 0);
        const tmtPnsB = new Date(b.tmt_pns || 0);
        if (tmtPnsA.getTime() !== tmtPnsB.getTime()) return tmtPnsA - tmtPnsB;
        if (hasDiklatpim(a) !== hasDiklatpim(b))
          return hasDiklatpim(b) - hasDiklatpim(a);
        if (rankPendidikan(a) !== rankPendidikan(b))
          return rankPendidikan(b) - rankPendidikan(a);
        const tglLahirA = new Date(a.tanggal_lahir || 0);
        const tglLahirB = new Date(b.tanggal_lahir || 0);
        return tglLahirA - tglLahirB;
      });

      setDukData(pnsAktif);
      setReportDate(
        new Date()
          .toLocaleDateString("id-ID", { month: "long", year: "numeric" })
          .toUpperCase()
      );
    } catch (err) {
      setError(
        "Gagal mengambil data pegawai untuk DUK. Pastikan API berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* --- CSS KHUSUS CETAK (DIPERBARUI DAN DIPERBAIKI) --- */}
      <style>
        {`
          @media print {
            @page {
              size: A4 landscape;
              margin: 1cm 0.5cm; 
            }
            body {
              -webkit-print-color-adjust: exact;
            }
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
            
            /* --- ATURAN BARU YANG LEBIH SPESIFIK & KUAT --- */
            
            /* Aturan untuk judul laporan */
            #print-area .text-center h2,
            #print-area .text-center h3,
            #print-area .text-center p {
                font-size: 12pt !important;
                font-weight: bold !important;
                margin-bottom: 8px !important;
            }
            
            /* Aturan untuk seluruh elemen tabel */
            #print-area table,
            #print-area th,
            #print-area td {
                font-size: 10pt !important; /* Ukuran font yang lebih besar untuk tabel */
                border: 1px solid black !important; /* Memaksa border terlihat */
                padding: 4px !important; /* Menyesuaikan padding */
                color: black !important; /* Memastikan warna teks hitam */
            }

            #print-area table {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
            }

            #print-area th {
                text-align: center !important;
                font-weight: bold !important;
                background-color: #f3f4f6 !important;
            }

            #print-area td {
                word-wrap: break-word;
            }
          }
        `}
      </style>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Laporan Daftar Urut Kepangkatan (DUK)
            </h1>
            <p className="text-base text-gray-600 mt-1">
              Generate dan cetak laporan DUK berdasarkan data pegawai terbaru.
            </p>
          </div>
          <button
            onClick={handleGenerateDuk}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FileSpreadsheet size={20} />
            )}
            {loading ? "Memproses..." : "Generate Laporan DUK"}
          </button>
        </div>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-lg no-print">
            {error}
          </div>
        )}

        {dukData && (
          <div id="print-area">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold uppercase">
                DAFTAR URUT KEPANGKATAN (D.U.K) PEGAWAI NEGERI SIPIL
              </h2>
              <h3 className="text-md font-bold uppercase">
                BAPPERIDA PROVINSI PAPUA BARAT DAYA
              </h3>
              <p className="text-sm font-bold uppercase">BULAN {reportDate}</p>
            </div>

            <div className="flex justify-end mb-4 no-print">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200"
              >
                <Printer size={16} /> Cetak
              </button>
            </div>

            <div className="overflow-x-auto">
              {/* Kelas text-sm di tabel ini yang menyebabkan masalah, tapi akan di-override oleh CSS print */}
              <table className="w-full text-sm">
                <thead className="bg-gray-100 font-bold text-center align-middle">
                  <tr>
                    <th
                      rowSpan="2"
                      className="p-2 border border-gray-300 w-[3%]"
                    >
                      No
                    </th>
                    <th
                      rowSpan="2"
                      className="p-2 border border-gray-300 w-[12%]"
                    >
                      Nama
                    </th>
                    <th
                      rowSpan="2"
                      className="p-2 border border-gray-300 w-[10%]"
                    >
                      Tempat / Tgl Lahir
                    </th>
                    <th
                      rowSpan="2"
                      className="p-2 border border-gray-300 w-[12%]"
                    >
                      NIP
                    </th>
                    <th
                      colSpan="2"
                      className="p-2 border border-gray-300 w-[8%]"
                    >
                      Pangkat
                    </th>
                    <th
                      colSpan="2"
                      className="p-2 border border-gray-300 w-[15%]"
                    >
                      Jabatan
                    </th>
                    <th
                      colSpan="2"
                      className="p-2 border border-gray-300 w-[8%]"
                    >
                      Masa Kerja Golongan
                    </th>
                    <th
                      colSpan="2"
                      className="p-2 border border-gray-300 w-[12%]"
                    >
                      Latihan Jabatan
                    </th>
                    <th
                      colSpan="2"
                      className="p-2 border border-gray-300 w-[12%]"
                    >
                      Pendidikan
                    </th>
                    <th
                      rowSpan="2"
                      className="p-2 border border-gray-300 w-[8%]"
                    >
                      KGB Berikutnya
                    </th>
                  </tr>
                  <tr>
                    <th className="p-2 border border-gray-300">Gol</th>
                    <th className="p-2 border border-gray-300">TMT</th>
                    <th className="p-2 border border-gray-300">Nama</th>
                    <th className="p-2 border border-gray-300">Eselon</th>
                    <th className="p-2 border border-gray-300">Thn</th>
                    <th className="p-2 border border-gray-300">Bln</th>
                    <th className="p-2 border border-gray-300">Nama</th>
                    <th className="p-2 border border-gray-300">Tahun</th>
                    <th className="p-2 border border-gray-300">Nama</th>
                    <th className="p-2 border border-gray-300">Tahun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dukData.map((p, index) => {
                    const masaKerjaGol = calculateMasaKerja(
                      p.tmt_pangkat_terakhir
                    );
                    const pendidikan = getHighestEducationAndYear(
                      p.RiwayatPendidikan
                    );
                    const diklat = getLatestDiklat(p.RiwayatDiklat);
                    const kgb = hitungJadwalKGB(p.tmt_kgb_terakhir);

                    return (
                      <tr key={p.id}>
                        <td className="p-2 border border-gray-300 text-center">
                          {index + 1}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {p.nama_lengkap}
                        </td>
                        <td className="p-2 border border-gray-300">{`${
                          p.tempat_lahir
                        }, ${new Date(p.tanggal_lahir).toLocaleDateString(
                          "id-ID"
                        )}`}</td>
                        <td className="p-2 border border-gray-300">{p.nip}</td>
                        <td className="p-2 border border-gray-300">
                          {p.Golongan?.golongan_ruang}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {new Date(p.tmt_pangkat_terakhir).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {p.Jabatan?.nama_jabatan}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {p.Jabatan?.eselon || "-"}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {masaKerjaGol.tahun}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {masaKerjaGol.bulan}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {diklat.nama}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {diklat.tahun}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {pendidikan.text}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {pendidikan.tahun}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {kgb.tanggal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !dukData && !error && (
          <div className="text-center py-16 px-4 bg-white rounded-xl shadow-lg border">
            <Inbox size={56} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Laporan Belum Dihasilkan
            </h3>
            <p className="text-gray-500 mt-2">
              Klik tombol "Generate Laporan DUK" untuk memulai.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default LaporanDukPage;
