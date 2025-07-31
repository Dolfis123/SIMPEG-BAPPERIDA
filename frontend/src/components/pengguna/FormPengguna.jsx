// src/components/pengguna/FormPengguna.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react"; // Impor ikon mata

const FormPengguna = ({ onSave, onClose, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "verifikator",
  });

  // State baru untuk konfirmasi dan visibilitas password
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        username: initialData.username || "",
        role: initialData.role || "verifikator",
        password: "",
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(""); // Reset error setiap kali submit

    // 1. Validasi: Pastikan password dan konfirmasi cocok
    if (formData.password !== confirmPassword) {
      setPasswordError("Password dan konfirmasi password tidak cocok.");
      return; // Hentikan proses jika tidak cocok
    }

    const dataToSave = { ...formData };

    if (isEditing && !dataToSave.password) {
      delete dataToSave.password;
    }

    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Username (NIP)
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* --- Input Password dengan Tombol Show/Hide --- */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password{" "}
          {isEditing && (
            <span className="text-xs text-gray-400">
              (Isi hanya jika ingin mengubah)
            </span>
          )}
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required={!isEditing}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* --- Input Konfirmasi Password --- */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Konfirmasi Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            required={!isEditing || (isEditing && formData.password)} // Wajib jika password diisi
          />
        </div>
        {passwordError && (
          <p className="mt-1 text-xs text-red-600">{passwordError}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Pilih Role</option>
          <option value="verifikator">Verifikator</option>
          <option value="admin_kepegawaian">Admin Kepegawaian</option>
          {/* <option value="super_admin">Super Admin</option> */}
        </select>
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

export default FormPengguna;
