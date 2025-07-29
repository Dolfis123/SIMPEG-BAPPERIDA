// src/api/laporanService.js
import api from './api';

export const getDUKData = async() => {
    try {
        const response = await api.get('/laporan/duk');
        return response.data.data;
    } catch (error) {
        // Menggunakan cara yang lebih aman untuk formatter lama
        let errorMessage = 'Gagal mengambil data DUK';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        throw new Error(errorMessage);
    }
};