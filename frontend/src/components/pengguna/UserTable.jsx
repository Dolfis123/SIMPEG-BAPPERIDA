// src/components/pengguna/UserTable.jsx
import React from "react";
import { Edit, Trash2, Shield } from "lucide-react";

const UserTable = ({ users, onEdit, onDelete, currentUser }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-xs text-gray-600 uppercase font-semibold">
          <tr>
            <th className="px-6 py-3">Username (NIP)</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {user.username}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`capitalize text-xs font-semibold px-3 py-1 rounded-full ${
                      user.role === "super_admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    {/* Mencegah super_admin menghapus dirinya sendiri */}
                    {currentUser.id !== user.id && (
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-16 px-4">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Shield size={48} className="mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Belum Ada Pengguna Lain
                  </h3>
                  <p className="mt-1">Silakan tambahkan pengguna baru.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
