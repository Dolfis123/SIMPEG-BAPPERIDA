// backend/routes/riwayatPendidikanRoutes.js
const express = require('express');
const router = express.Router();
const riwayatPendidikanController = require('../controllers/riwayatPendidikanController');
// const { authenticateToken, authorizeRole } = require('../middleware/auth'); // Opsional: Tambahkan middleware jika perlu

// Rute untuk mendapatkan semua riwayat pendidikan seorang pegawai
router.get('/pegawai/:pegawaiId/pendidikan', riwayatPendidikanController.getAllPendidikanByPegawaiId);

// Rute untuk menambah riwayat pendidikan baru untuk seorang pegawai
router.post('/pegawai/:pegawaiId/pendidikan', riwayatPendidikanController.createPendidikan);

// Rute untuk mengupdate satu riwayat pendidikan spesifik berdasarkan ID riwayatnya
router.put('/pendidikan/:id', riwayatPendidikanController.updatePendidikan);

// Rute untuk menghapus satu riwayat pendidikan spesifik berdasarkan ID riwayatnya
router.delete('/pendidikan/:id', riwayatPendidikanController.deletePendidikan);

module.exports = router;