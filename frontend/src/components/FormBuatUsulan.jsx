/* eslint-disable no-unused-vars */
// src/components/FormBuatUsulan.jsx
import React, { useState, useEffect } from "react";
import { createUsulan } from "../api/usulanService";
import { getAllPegawai } from "../api/pegawaiService";
import { Loader2 } from "lucide-react";

const FormBuatUsulan = ({ onClose, onSuccess, initialData }) => {
  const [pegawaiList, setPegawaiList] = useState([]);
  const [formData, setFormData] = useState({
    pegawai_id: "",
    jenis_usulan: "KGB",
    sub_jenis_kp_pilihan: "", // State untuk menyimpan pilihan detail
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        const data = await getAllPegawai();
        setPegawaiList(data);
      } catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
      } finally {
        setLoading(false);
      }
    };

    if (initialData) {
      setFormData({
        pegawai_id: initialData.pegawai_id,
        jenis_usulan: initialData.jenis_usulan,
        sub_jenis_kp_pilihan: "",
      });
      setPegawaiList([
        { id: initialData.pegawai_id, nama_lengkap: initialData.nama_lengkap },
      ]);
      setLoading(false);
    } else {
      fetchPegawai();
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSend = { ...formData };
      if (dataToSend.jenis_usulan !== "KP Pilihan") {
        dataToSend.sub_jenis_kp_pilihan = null;
      }
      await createUsulan(dataToSend);
      alert("Usulan baru berhasil dibuat!");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Gagal membuat usulan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="pegawai_id"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Pegawai
        </label>
        <select
          name="pegawai_id"
          value={formData.pegawai_id}
          onChange={handleChange}
          className="input-style"
          required
          disabled={!!initialData}
        >
          <option value="">-- Pilih Pegawai --</option>
          {pegawaiList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_lengkap} ({p.nip})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="jenis_usulan"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Jenis Usulan
        </label>
        <select
          name="jenis_usulan"
          value={formData.jenis_usulan}
          onChange={handleChange}
          className="input-style"
          required
          disabled={!!initialData && initialData.jenis_usulan !== "KP Pilihan"}
        >
          <option value="KGB">Kenaikan Gaji Berkala (KGB)</option>
          <option value="KP Reguler">Kenaikan Pangkat (KP) Reguler</option>
          <option value="KP Pilihan">Kenaikan Pangkat (KP) Pilihan</option>
        </select>
      </div>

      {/* --- BAGIAN YANG HILANG, SEKARANG SUDAH ADA --- */}
      {formData.jenis_usulan === "KP Pilihan" && (
        <div>
          <label
            htmlFor="sub_jenis_kp_pilihan"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Detail KP Pilihan
          </label>
          <select
            name="sub_jenis_kp_pilihan"
            value={formData.sub_jenis_kp_pilihan}
            onChange={handleChange}
            className="input-style"
            required // Wajib diisi jika KP Pilihan dipilih
          >
            <option value="">-- Pilih Jenis KP Pilihan --</option>
            <option value="Jabatan">Karena Jabatan</option>
            <option value="Prestasi">Prestasi Luar Biasa</option>
            <option value="Ijazah">Penyesuaian Ijazah</option>
            <option value="Tugas Belajar">Selesai Tugas Belajar</option>
            <option value="Pengabdian">Pengabdian (Pensiun)</option>
            <option value="Anumerta">Anumerta</option>
            <option value="Cacat Dinas">Cacat Dalam Dinas</option>
            <option value="Penemuan Baru">Penemuan Baru</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          {isSubmitting && <Loader2 className="animate-spin mr-2" size={16} />}
          {isSubmitting ? "Membuat..." : "Buat Usulan"}
        </button>
      </div>
    </form>
  );
};
export default FormBuatUsulan;
