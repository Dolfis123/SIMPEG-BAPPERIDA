// src/api/dashboardService.js
import api from './api';

/**
 * Ekstrak pesan error dari response API.
 * @param {any} error - Objek error.
 * @param {string} fallback - Pesan fallback jika tidak ada detail error.
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
 * Mengambil statistik dashboard (jumlah pegawai, usulan, dll).
 * @returns {Promise<object>}
 */
export const getDashboardStats = async() => {
    try {
        const response = await api.get('/dashboard/stats');
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Gagal mengambil data statistik'));
    }
};

/**
 * Mengambil 5 usulan terbaru dengan status Diajukan.
 * @returns {Promise<Array>}
 */
export const getRecentUsulan = async() => {
    try {
        const response = await api.get('/usulan?limit=5&status=Diajukan');
        return response.data.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Gagal mengambil aktivitas terbaru'));
    }
};

/**
 * Mengambil data analitik lengkap dashboard.
 * @returns {Promise<object>}
 */
export const getFullAnalytics = async() => {
    try {
        const response = await api.get('/dashboard/analytics');
        return response.data;
    } catch (error) {
        throw new Error(extractErrorMessage(error, 'Gagal mengambil data analitik'));
    }
};