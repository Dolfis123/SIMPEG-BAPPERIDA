// routes/usulanRoutes.js
const express = require('express');
const router = express.Router();
const usulanController = require('../controllers/usulanController');
const authMiddleware = require('../middlewares/authMiddleware'); // <-- Impor middleware

// Rute untuk membuat usulan baru, kini dilindungi oleh middleware
// Hanya user yang login (memiliki token valid) yang bisa mengakses.
router.post('/usulan', authMiddleware, usulanController.createUsulan);

// Rute untuk mengubah status usulan juga harus dilindungi
router.put('/usulan/:id/status', authMiddleware, usulanController.updateStatusUsulan);

// Rute ini bisa saja tetap publik atau bisa juga dilindungi
router.get('/usulan', usulanController.getAllUsulan);
router.get('/usulan/:id', usulanController.getUsulanById);

module.exports = router;