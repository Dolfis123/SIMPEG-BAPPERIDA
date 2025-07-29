// src/components/pengaturan/FormGolongan.jsx
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const FormGolongan = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    golongan_ruang: "",
    nama_pangkat: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Jika ada data awal (mode edit), isi form dengan data tersebut
    if (initialData) {
      setFormData({
        golongan_ruang: initialData.golongan_ruang || "",
        nama_pangkat: initialData.nama_pangkat || "",
      });
    }
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
          htmlFor="golongan_ruang"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Golongan / Ruang
        </label>
        <input
          type="text"
          name="golongan_ruang"
          value={formData.golongan_ruang}
          onChange={handleChange}
          className="input-style"
          placeholder="Contoh: III/a"
          required
        />
      </div>
      <div>
        <label
          htmlFor="nama_pangkat"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Nama Pangkat
        </label>
        <input
          type="text"
          name="nama_pangkat"
          value={formData.nama_pangkat}
          onChange={handleChange}
          className="input-style"
          placeholder="Contoh: Penata Muda"
          required
        />
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

export default FormGolongan;
