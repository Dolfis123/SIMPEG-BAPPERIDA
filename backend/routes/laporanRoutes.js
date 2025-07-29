// backend/routes/laporanRoutes.js
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

// Rute untuk mendapatkan data DUK
router.get('/laporan/duk', laporanController.getDUK);

module.exports = router;