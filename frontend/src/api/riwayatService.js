// src/api/riwayatService.js
import api from './api';

/**
 * Mengambil riwayat pangkat seorang pegawai berdasarkan ID pegawai.
 * @param {number} pegawaiId - ID dari pegawai.
 * @returns {Promise<Array>} Array data riwayat pangkat.
 */
export const getRiwayatPangkat = async(pegawaiId) => {
    try {
        const response = await api.get(`/riwayat/pangkat/${pegawaiId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching riwayat pangkat for pegawai ID ${pegawaiId}:`, error);
        const message =
            error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal mengambil data riwayat pangkat';
        throw new Error(message);
    }
};