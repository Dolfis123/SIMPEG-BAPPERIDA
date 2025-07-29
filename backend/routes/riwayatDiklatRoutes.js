// backend/routes/riwayatDiklatRoutes.js
const express = require('express');
const router = express.Router();
const riwayatDiklatController = require('../controllers/riwayatDiklatController');
// const { authenticateToken, authorizeRole } = require('../middleware/auth'); // Opsional

// Rute untuk mendapatkan semua riwayat diklat seorang pegawai
router.get('/pegawai/:pegawaiId/diklat', riwayatDiklatController.getAllDiklatByPegawaiId);

// Rute untuk menambah riwayat diklat baru untuk seorang pegawai
router.post('/pegawai/:pegawaiId/diklat', riwayatDiklatController.createDiklat);

// Rute untuk mengupdate satu riwayat diklat spesifik berdasarkan ID riwayatnya
router.put('/diklat/:id', riwayatDiklatController.updateDiklat);

// Rute untuk menghapus satu riwayat diklat spesifik berdasarkan ID riwayatnya
router.delete('/diklat/:id', riwayatDiklatController.deleteDiklat);

module.exports = router;