// frontend/src/api/riwayatPendidikanService.js
import api from './api';

/**
 * Mengambil semua riwayat pendidikan untuk seorang pegawai.
 * @param {number} pegawaiId - ID dari pegawai.
 * @returns {Promise<Array>}
 */
export const getPendidikanByPegawaiId = async(pegawaiId) => {
    const response = await api.get(`/pegawai/${pegawaiId}/pendidikan`);
    return response.data.data;
};

/**
 * Menambah riwayat pendidikan baru.
 * @param {number} pegawaiId - ID pegawai yang bersangkutan.
 * @param {object} data - Data pendidikan dari form.
 * @returns {Promise<object>}
 */
export const createPendidikan = async(pegawaiId, data) => {
    const response = await api.post(`/pegawai/${pegawaiId}/pendidikan`, data);
    return response.data;
};

/**
 * Mengupdate satu data riwayat pendidikan.
 * @param {number} id - ID dari riwayat pendidikan.
 * @param {object} data - Data baru dari form.
 * @returns {Promise<object>}
 */
export const updatePendidikan = async(id, data) => {
    const response = await api.put(`/pendidikan/${id}`, data);
    return response.data;
};

/**
 * Menghapus satu data riwayat pendidikan.
 * @param {number} id - ID dari riwayat pendidikan.
 * @returns {Promise<object>}
 */
export const deletePendidikan = async(id) => {
    const response = await api.delete(`/pendidikan/${id}`);
    return response.data;
};