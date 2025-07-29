// src/api/masterDataService.js
import api from './api';

// Golongan
export const getGolongan = () => api.get('/golongan');
export const createGolongan = (data) => api.post('/golongan', data);
export const updateGolongan = (id, data) => api.put(`/golongan/${id}`, data);
export const deleteGolongan = async(id) => {
    const response = await api.delete(`/golongan/${id}`);
    return response.data;
};

// Jabatan
export const getJabatan = () => api.get('/jabatan');
export const createJabatan = (data) => api.post('/jabatan', data);
export const updateJabatan = (id, data) => api.put(`/jabatan/${id}`, data);
export const deleteJabatan = async(id) => {
    try {
        const response = await api.delete(`/jabatan/${id}`);
        return response.data;
    } catch (error) {
        // Menggunakan cara yang lebih aman untuk formatter lama
        let errorMessage = 'Gagal menghapus data jabatan.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        throw errorMessage;
    }
};

// Unit Kerja
export const getUnitKerja = () => api.get('/unit-kerja');
export const createUnitKerja = (data) => api.post('/unit-kerja', data);
export const updateUnitKerja = (id, data) => api.put(`/unit-kerja/${id}`, data);
export const deleteUnitKerja = async(id) => {
    try {
        const response = await api.delete(`/unit-kerja/${id}`);
        return response.data;
    } catch (error) {
        // Menggunakan cara yang lebih aman untuk formatter lama
        let errorMessage = 'Gagal menghapus data unit kerja.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        throw errorMessage;
    }
};