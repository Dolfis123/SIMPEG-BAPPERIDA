// src/api/authService.js
import api from './api';

export const loginUser = async(username, password) => {
    try {
        const response = await api.post('/users/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        // --- GANTI DENGAN BLOK INI ---
        let errorMessage = 'Terjadi kesalahan pada server';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        throw errorMessage;
        // --- SAMPAI SINI ---
    }
};