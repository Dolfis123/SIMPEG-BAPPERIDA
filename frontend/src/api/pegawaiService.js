// src/api/pegawaiService.js
import api from './api';

/**
 * Ekstrak pesan error dari response.
 * @param {any} error - Objek error dari catch.
 * @param {string} fallback - Pesan fallback jika tidak ada message dari server.
 * @returns {string}
 */
const extractErrorMessage = (error, fallback) => {
    return (
        (error &&
            error.response &&
            error.response.data &&
            error.response.data.message) ||
        fallback
    );
};

/**
 * Mengambil semua data pegawai dari server.
 * @returns {Promise<Array>} Array berisi data pegawai.
 */
export const getAllPegawai = async() => {
    try {
        const response = await api.get('/pegawai');
        return response.data.data;
    } catch (error) {
        console.error("Error fetching all pegawai:", error);
        throw new Error(extractErrorMessage(error, 'Gagal mengambil data pegawai'));
    }
};

/**
 * Mengambil data detail satu pegawai berdasarkan ID.
 * @param {number} id - ID dari pegawai.
 * @returns {Promise<object>} Objek berisi data detail pegawai.
 */
export const getPegawaiById = async(id) => {
    try {
        const response = await api.get(`/pegawai/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching pegawai with id ${id}:`, error);
        throw new Error(extractErrorMessage(error, 'Gagal mengambil detail pegawai'));
    }
};

/**
 * Membuat data pegawai baru.
 * @param {object} data - Data pegawai baru dari form.
 * @returns {Promise<object>} Data pegawai yang baru dibuat.
 */
export const createPegawai = async(data) => {
    try {
        const response = await api.post('/pegawai', data);
        return response.data;
    } catch (error) {
        console.error("Error creating pegawai:", error);
        throw new Error(extractErrorMessage(error, 'Gagal membuat data pegawai'));
    }
};

/**
 * Memperbarui data pegawai yang sudah ada.
 * @param {number} id - ID dari pegawai yang akan diupdate.
 * @param {object} data - Data baru untuk pegawai.
 * @returns {Promise<object>} Data pegawai yang sudah diperbarui.
 */
export const updatePegawai = async(id, data) => {
    try {
        const response = await api.put(`/pegawai/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating pegawai with id ${id}:`, error);
        throw new Error(extractErrorMessage(error, 'Gagal memperbarui data pegawai'));
    }
};

/**
 * Menghapus data pegawai.
 * @param {number} id - ID dari pegawai yang akan dihapus.
 * @returns {Promise<object>} Pesan konfirmasi dari server.
 */
export const deletePegawai = async(id) => {
    try {
        const response = await api.delete(`/pegawai/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting pegawai with id ${id}:`, error);
        throw new Error(extractErrorMessage(error, 'Gagal menghapus data pegawai'));
    }
};