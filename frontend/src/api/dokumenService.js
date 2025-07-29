// src/api/dokumenService.js
import api from './api';

/**
 * Mengambil semua dokumen milik seorang pegawai.
 * @param {number} pegawaiId - ID dari pegawai.
 */
export const getDokumenByPegawaiId = async(pegawaiId) => {
    try {
        const response = await api.get(`/dokumen/pegawai/${pegawaiId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching dokumen for pegawai ID ${pegawaiId}:`, error);
        const message =
            error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal mengambil data dokumen';
        throw new Error(message);
    }
};

/**
 * Mengunggah dokumen baru.
 * @param {FormData} formData - Data form yang berisi file dan info lainnya.
 */
export const uploadDokumen = async(formData) => {
    try {
        const response = await api.post('/dokumen/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading dokumen:', error);
        const message =
            error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal mengunggah dokumen';
        throw new Error(message);
    }
};
/**
 * Memperbarui kategori dokumen.
 * @param {number} id - ID dari dokumen.
 * @param {object} data - Contoh: { kategori_dokumen: 'SK Pangkat Baru' }
 */
export const updateDokumen = async(id, data) => {
    try {
        const response = await api.put(`/dokumen/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating dokumen with id ${id}:`, error);
        const message =
            error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal memperbarui dokumen';
        throw new Error(message);
    }
};

/**
 * Menghapus dokumen.
 * @param {number} id - ID dari dokumen yang akan dihapus.
 */
export const deleteDokumen = async(id) => {
    try {
        const response = await api.delete(`/dokumen/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting dokumen with id ${id}:`, error);
        const message =
            error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal menghapus dokumen';
        throw new Error(message);
    }
};

/**
 * Mengganti file dokumen yang sudah ada.
 * @param {number} id - ID dari dokumen yang akan diganti.
 * @param {FormData} formData - Data form yang berisi file baru.
 */
export const replaceDokumen = async(id, formData) => {
    try {
        const response = await api.put(`/dokumen/${id}/replace`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error replacing dokumen with id ${id}:`, error);
        const message =
            error && error.response && error.response.data && error.response.data.message ?
            error.response.data.message :
            'Gagal mengganti file dokumen';
        throw new Error(message);
    }
};


/**
 * Menghapus dokumen.
 * @param {number} id - ID dari dokumen yang akan dihapus.
 */
// export const deleteDokumen = (id) => api.delete(`/dokumen/${id}`); // (Ini perlu endpoint baru di backend)