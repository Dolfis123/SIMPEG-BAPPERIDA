// backend/routes/jabatanRoutes.js
const express = require('express');
const router = express.Router();
const jabatanController = require('../controllers/jabatanController');

router.get('/jabatan', jabatanController.getAllJabatan);
router.post('/jabatan', jabatanController.createJabatan);

// --- RUTE BARU UNTUK UPDATE DAN DELETE ---
router.put('/jabatan/:id', jabatanController.updateJabatan);
router.delete('/jabatan/:id', jabatanController.deleteJabatan);

module.exports = router;