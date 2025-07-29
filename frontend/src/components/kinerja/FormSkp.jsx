// src/components/kinerja/FormSkp.jsx
import React, { useState, useEffect } from "react";
import { getAllPegawai } from "../../api/pegawaiService";
import { Loader2 } from "lucide-react";

const FormSkp = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    pegawai_id: "",
    tahun_penilaian: new Date().getFullYear(),
    predikat_kinerja: "Baik",
  });
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loadingPegawai, setLoadingPegawai] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Jika ini adalah mode edit, isi form dengan data awal
    if (initialData) {
      setFormData({
        pegawai_id: initialData.pegawai_id,
        tahun_penilaian: initialData.tahun_penilaian,
        predikat_kinerja: initialData.predikat_kinerja,
      });
    }

    // Ambil daftar pegawai untuk dropdown
    const fetchPegawai = async () => {
      try {
        const data = await getAllPegawai();
        setPegawaiList(data);
      } catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
      } finally {
        setLoadingPegawai(false);
      }
    };

    fetchPegawai();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData); // Panggil fungsi onSave dari parent
    setIsSubmitting(false);
  };

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
          disabled={!!initialData || loadingPegawai} // Nonaktifkan jika mode edit atau sedang loading
        >
          <option value="">
            {loadingPegawai ? "Memuat..." : "Pilih Pegawai"}
          </option>
          {pegawaiList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_lengkap} ({p.nip})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="tahun_penilaian"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Tahun Penilaian
        </label>
        <input
          type="number"
          name="tahun_penilaian"
          value={formData.tahun_penilaian}
          onChange={handleChange}
          className="input-style"
          placeholder="YYYY"
          required
        />
      </div>
      <div>
        <label
          htmlFor="predikat_kinerja"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Predikat Kinerja
        </label>
        <select
          name="predikat_kinerja"
          value={formData.predikat_kinerja}
          onChange={handleChange}
          className="input-style"
          required
        >
          <option>Sangat Baik</option>
          <option>Baik</option>
          <option>Butuh Perbaikan</option>
          <option>Kurang</option>
          <option>Sangat Kurang</option>
        </select>
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

export default FormSkp;
