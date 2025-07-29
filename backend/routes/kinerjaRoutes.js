// backend/routes/kinerjaRoutes.js
const express = require('express');
const router = express.Router();
const kinerjaController = require('../controllers/kinerjaController');

// Mengganti rute lama dengan yang lebih standar
router.post('/kinerja', kinerjaController.addKinerja);
router.get('/kinerja', kinerjaController.getAllKinerja); // Untuk mengambil semua data
router.put('/kinerja/:id', kinerjaController.updateKinerja);
router.delete('/kinerja/:id', kinerjaController.deleteKinerja);

module.exports = router;