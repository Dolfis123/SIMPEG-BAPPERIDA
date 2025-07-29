// src/components/pengaturan/FormJabatan.jsx
import React, { useState, useEffect } from "react";

const FormJabatan = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    nama_jabatan: "",
    jenis_jabatan: "Fungsional Umum",
    eselon: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_jabatan: initialData.nama_jabatan || "",
        jenis_jabatan: initialData.jenis_jabatan || "Fungsional Umum",
        eselon: initialData.eselon || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nama_jabatan"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Jabatan
        </label>
        <input
          id="nama_jabatan"
          type="text"
          name="nama_jabatan"
          value={formData.nama_jabatan}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="jenis_jabatan"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Jenis Jabatan
        </label>
        <select
          id="jenis_jabatan"
          name="jenis_jabatan"
          value={formData.jenis_jabatan}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="Fungsional Umum">Fungsional Umum</option>
          <option value="Fungsional Tertentu">Fungsional Tertentu</option>
          <option value="Struktural">Struktural</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="eselon"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Eselon (Contoh: II.a, III.b)
        </label>
        <input
          id="eselon"
          type="text"
          name="eselon"
          value={formData.eselon}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Kosongkan jika bukan jabatan struktural"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default FormJabatan;
