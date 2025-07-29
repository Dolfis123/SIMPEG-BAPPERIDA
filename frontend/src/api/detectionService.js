// src/api/detectionService.js
import api from './api';

/**
 * Mendeteksi calon pegawai yang potensial untuk KGB dan KP.
 * @returns {Promise<object>} Objek berisi { potentialKGB, potentialKP }
 */
export const findPotentialCandidates = async() => {
    try {
        const response = await api.get('/deteksi/potensial');
        return response.data.data; // Mengembalikan objek { potentialKGB, potentialKP }
    } catch (error) {
        console.error("Error finding potential candidates:", error);
        const message = error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal menjalankan deteksi otomatis';
        throw new Error(message);
    }
};