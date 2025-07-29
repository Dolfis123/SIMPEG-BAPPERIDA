// frontend/src/api/riwayatDiklatService.js
import api from './api';

/**
 * Mengambil semua riwayat diklat untuk seorang pegawai.
 * @param {number} pegawaiId - ID dari pegawai.
 * @returns {Promise<Array>}
 */
export const getDiklatByPegawaiId = async(pegawaiId) => {
    const response = await api.get(`/pegawai/${pegawaiId}/diklat`);
    return response.data.data;
};

/**
 * Menambah riwayat diklat baru.
 * @param {number} pegawaiId - ID pegawai yang bersangkutan.
 * @param {object} data - Data diklat dari form.
 * @returns {Promise<object>}
 */
export const createDiklat = async(pegawaiId, data) => {
    const response = await api.post(`/pegawai/${pegawaiId}/diklat`, data);
    return response.data;
};

/**
 * Mengupdate satu data riwayat diklat.
 * @param {number} id - ID dari riwayat diklat.
 * @param {object} data - Data baru dari form.
 * @returns {Promise<object>}
 */
export const updateDiklat = async(id, data) => {
    const response = await api.put(`/diklat/${id}`, data);
    return response.data;
};

/**
 * Menghapus satu data riwayat diklat.
 * @param {number} id - ID dari riwayat diklat.
 * @returns {Promise<object>}
 */
export const deleteDiklat = async(id) => {
    const response = await api.delete(`/diklat/${id}`);
    return response.data;
};