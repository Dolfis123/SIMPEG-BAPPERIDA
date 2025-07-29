// src/api/usulanService.js
import api from './api';

/**
 * Mengambil semua data usulan dari server.
 */
export const getAllUsulan = async() => {
    try {
        const response = await api.get('/usulan');
        return response.data.data; // Mengembalikan array data usulan
    } catch (error) {
        console.error("Error fetching all usulan:", error);
        const message = error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal mengambil data usulan';
        throw new Error(message);
    }
};

/**
 * Membuat usulan baru.
 * @param {object} data - Data usulan dari form.
 */
export const createUsulan = async(data) => {
    try {
        const response = await api.post('/usulan', data);
        return response.data;
    } catch (error) {
        console.error("Error creating usulan:", error);
        const message = error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal membuat usulan baru';
        throw new Error(message);
    }
};

/**
 * Memperbarui status sebuah usulan (approve/reject).
 * @param {number} id - ID dari usulan yang akan diupdate.
 * @param {object} data - Data baru, contoh: { status_usulan: 'Disetujui' }
 */
export const updateStatusUsulan = async(id, data) => {
    try {
        const response = await api.put(`/usulan/${id}/status`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating usulan status for id ${id}:`, error);
        const message = error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal memperbarui status usulan';
        throw new Error(message);
    }
};

/**
 * Mengambil detail satu usulan berdasarkan ID.
 * @param {number} id - ID dari usulan.
 */
export const getUsulanById = async(id) => {
    try {
        const response = await api.get(`/usulan/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching usulan with id ${id}:`, error);
        const message = error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal mengambil detail usulan';
        throw new Error(message);
    }
};