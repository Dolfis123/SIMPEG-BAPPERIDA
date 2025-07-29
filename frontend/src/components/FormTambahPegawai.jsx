/* eslint-disable no-unused-vars */
// src/components/FormTambahPegawai.jsx
import React, { useState, useEffect } from "react";
import {
  getGolongan,
  getJabatan,
  getUnitKerja,
} from "../api/masterDataService";
import { createPegawai } from "../api/pegawaiService";
import { Loader2 } from "lucide-react";

const FormTambahPegawai = ({ onClose, onSuccess }) => {
  // State ini sekarang mencakup SEMUA kolom dari model Pegawai Anda
  const [formData, setFormData] = useState({
    nip: "",
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    agama: "",
    status_pernikahan: "",
    alamat: "",
    no_hp: "",
    email: "",
    status_kepegawaian: "PNS",
    tmt_cpns: "",
    tmt_pns: "",
    tmt_jabatan_sekarang: "",
    tmt_pangkat_terakhir: "",
    tmt_kgb_terakhir: "",
    id_golongan: "",
    id_jabatan: "",
    id_unit_kerja: "",
    status_pegawai: "Aktif",
  });

  const [masterData, setMasterData] = useState({
    golongan: [],
    jabatan: [],
    unitKerja: [],
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [golonganRes, jabatanRes, unitKerjaRes] = await Promise.all([
          getGolongan(),
          getJabatan(),
          getUnitKerja(),
        ]);
        setMasterData({
          golongan: golonganRes.data.data,
          jabatan: jabatanRes.data.data,
          unitKerja: unitKerjaRes.data.data,
        });
      } catch (error) {
        setError("Gagal memuat data referensi.");
      } finally {
        setLoading(false);
      }
    };
    fetchMasterData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Menangani input yang mungkin kosong untuk dikirim sebagai null
    const valueToSend = value === "" ? null : value;
    setFormData((prevState) => ({ ...prevState, [name]: valueToSend }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await createPegawai(formData);
      // alert("Pegawai baru berhasil ditambahkan!");
      onSuccess();
      onClose();
    } catch (err) {
      // Menangkap pesan error spesifik dari backend dan menampilkannya
      alert(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin" /> Memuat data...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[75vh] overflow-y-auto pr-4"
    >
      {error && (
        <div className="p-3 text-center text-sm font-medium text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* --- DATA POKOK (WAJIB DIISI) --- */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-slate-600 border-b pb-1">
            Data Pokok
          </h4>
        </div>
        <div>
          <label
            htmlFor="nip"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            NIP
          </label>
          <input
            type="text"
            name="nip"
            value={formData.nip}
            onChange={handleChange}
            className="input-style"
            required
          />
        </div>
        <div>
          <label
            htmlFor="nama_lengkap"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            className="input-style"
            required
          />
        </div>
        <div>
          <label
            htmlFor="id_golongan"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Golongan
          </label>
          <select
            name="id_golongan"
            value={formData.id_golongan}
            onChange={handleChange}
            className="input-style"
            required
          >
            <option value="">Pilih Golongan</option>
            {masterData.golongan.map((g) => (
              <option key={g.id} value={g.id}>
                {g.golongan_ruang} - {g.nama_pangkat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="id_jabatan"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Jabatan
          </label>
          <select
            name="id_jabatan"
            value={formData.id_jabatan}
            onChange={handleChange}
            className="input-style"
            required
          >
            <option value="">Pilih Jabatan</option>
            {masterData.jabatan.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama_jabatan}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="id_unit_kerja"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Unit Kerja
          </label>
          <select
            name="id_unit_kerja"
            value={formData.id_unit_kerja}
            onChange={handleChange}
            className="input-style"
            required
          >
            <option value="">Pilih Unit Kerja</option>
            {masterData.unitKerja.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nama_unit_kerja}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status_kepegawaian"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Status Kepegawaian
          </label>
          <select
            name="status_kepegawaian"
            value={formData.status_kepegawaian}
            onChange={handleChange}
            className="input-style"
          >
            <option>PNS</option>
            <option>CPNS</option>
            <option>PPPK</option>
            <option>Honorer</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="tmt_pangkat_terakhir"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            TMT Pangkat Terakhir
          </label>
          <input
            type="date"
            name="tmt_pangkat_terakhir"
            value={formData.tmt_pangkat_terakhir}
            onChange={handleChange}
            className="input-style"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tmt_kgb_terakhir"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            TMT KGB Terakhir
          </label>
          <input
            type="date"
            name="tmt_kgb_terakhir"
            value={formData.tmt_kgb_terakhir}
            onChange={handleChange}
            className="input-style"
            required
          />
        </div>

        {/* --- DATA PRIBADI (OPSIONAL) --- */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-slate-600 border-b pb-1 mt-4">
            Data Pribadi
          </h4>
        </div>
        <div>
          <label
            htmlFor="tempat_lahir"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Tempat Lahir
          </label>
          <input
            type="text"
            name="tempat_lahir"
            value={formData.tempat_lahir}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <div>
          <label
            htmlFor="tanggal_lahir"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Tanggal Lahir
          </label>
          <input
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <div>
          <label
            htmlFor="jenis_kelamin"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Jenis Kelamin
          </label>
          <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="input-style"
          >
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="agama"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Agama
          </label>
          <input
            type="text"
            name="agama"
            value={formData.agama}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <div>
          <label
            htmlFor="status_pernikahan"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Status Pernikahan
          </label>
          <input
            type="text"
            name="status_pernikahan"
            value={formData.status_pernikahan}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <div>
          <label
            htmlFor="no_hp"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            No. Handphone
          </label>
          <input
            type="text"
            name="no_hp"
            value={formData.no_hp}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="alamat"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Alamat
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            className="input-style"
            rows="3"
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-style"
          />
        </div>

        {/* --- DATA TMT LAINNYA (OPSIONAL) --- */}
        <div className="md:col-span-2">
          <h4 className="font-semibold text-slate-600 border-b pb-1 mt-4">
            Data TMT Lainnya
          </h4>
        </div>
        <div>
          <label
            htmlFor="tmt_cpns"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            TMT CPNS
          </label>
          <input
            type="date"
            name="tmt_cpns"
            value={formData.tmt_cpns}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <div>
          <label
            htmlFor="tmt_pns"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            TMT PNS
          </label>
          <input
            type="date"
            name="tmt_pns"
            value={formData.tmt_pns}
            onChange={handleChange}
            className="input-style"
          />
        </div>
        <div>
          <label
            htmlFor="tmt_jabatan_sekarang"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            TMT Jabatan Sekarang
          </label>
          <input
            type="date"
            name="tmt_jabatan_sekarang"
            value={formData.tmt_jabatan_sekarang}
            onChange={handleChange}
            className="input-style"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
        >
          {isSubmitting && <Loader2 className="animate-spin mr-2" size={16} />}
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};
export default FormTambahPegawai;
