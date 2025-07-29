// backend/routes/golonganRoutes.js
const express = require('express');
const router = express.Router();
const golonganController = require('../controllers/golonganController');

// ... (rute GET dan POST yang sudah ada) ...
router.get('/golongan', golonganController.getAllGolongan);
router.post('/golongan', golonganController.createGolongan);

// --- RUTE BARU UNTUK UPDATE DAN DELETE ---
router.put('/golongan/:id', golonganController.updateGolongan);
router.delete('/golongan/:id', golonganController.deleteGolongan);

module.exports = router;