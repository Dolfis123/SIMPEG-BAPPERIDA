// backend/routes/riwayatRoutes.js
const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayatController');

// Rute untuk mendapatkan riwayat pangkat berdasarkan ID pegawai
router.get('/riwayat/pangkat/:pegawaiId', riwayatController.getRiwayatPangkat);

module.exports = router;