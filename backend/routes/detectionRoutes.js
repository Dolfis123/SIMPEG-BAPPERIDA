// backend/routes/detectionRoutes.js
const express = require('express');
const router = express.Router();
const detectionController = require('../controllers/detectionController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Rute untuk menjalankan deteksi pegawai potensial
// router.get('/deteksi/potensial', authMiddleware, detectionController.findPotentialCandidates);
router.get('/deteksi/potensial', detectionController.findPotentialCandidates);


module.exports = router;