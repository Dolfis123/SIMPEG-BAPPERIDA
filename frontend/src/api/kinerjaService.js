// src/api/kinerjaService.js
import api from './api';

export const getAllKinerja = () => api.get('/kinerja');
export const addKinerja = (data) => api.post('/kinerja', data);
export const updateKinerja = (id, data) => api.put(`/kinerja/${id}`, data);
export const deleteKinerja = (id) => api.delete(`/kinerja/${id}`);