// src/components/pengaturan/FormUnitKerja.jsx
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const FormUnitKerja = ({ onClose, onSave, initialData, unitKerjaList }) => {
  const [formData, setFormData] = useState({
    nama_unit_kerja: "",
    id_induk: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_unit_kerja: initialData.nama_unit_kerja || "",
        id_induk: initialData.id_induk || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Jika user memilih "-- Tidak Ada Induk --", nilainya akan menjadi null
    setFormData((prevState) => ({
      ...prevState,
      [name]: value === "" ? null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nama_unit_kerja"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Nama Unit Kerja
        </label>
        <input
          type="text"
          name="nama_unit_kerja"
          value={formData.nama_unit_kerja}
          onChange={handleChange}
          className="input-style"
          required
        />
      </div>
      <div>
        <label
          htmlFor="id_induk"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Unit Kerja Induk (Opsional)
        </label>
        <select
          name="id_induk"
          value={formData.id_induk || ""}
          onChange={handleChange}
          className="input-style"
        >
          <option value="">-- Tidak Ada Induk --</option>
          {unitKerjaList
            // Mencegah sebuah unit kerja menjadi induk dari dirinya sendiri saat mode edit
            .filter((u) => !initialData || u.id !== initialData.id)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.nama_unit_kerja}
              </option>
            ))}
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

export default FormUnitKerja;
