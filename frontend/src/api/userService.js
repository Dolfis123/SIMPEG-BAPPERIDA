// frontend/src/api/userService.js
import api from './api';

/**
 * Mengambil semua data pengguna dari server.
 * @returns {Promise<Array>}
 */
export const getAllUsers = async() => {
    const response = await api.get('/users');
    return response.data.data;
};

/**
 * Membuat pengguna baru.
 * @param {object} userData - Data pengguna dari form (username, password, role).
 * @returns {Promise<object>}
 */
export const createUser = async(userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
};

/**
 * Mengupdate data pengguna.
 * @param {number} id - ID dari pengguna yang akan diupdate.
 * @param {object} userData - Data baru untuk pengguna (username, role, password opsional).
 * @returns {Promise<object>}
 */
export const updateUser = async(id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

/**
 * Menghapus pengguna.
 * @param {number} id - ID dari pengguna yang akan dihapus.
 * @returns {Promise<object>}
 */
export const deleteUser = async(id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};