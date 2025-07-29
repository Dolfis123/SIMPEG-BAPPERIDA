// backend/routes/unitKerjaRoutes.js
const express = require('express');
const router = express.Router();
const unitKerjaController = require('../controllers/unitKerjaController');

router.get('/unit-kerja', unitKerjaController.getAllUnitKerja);
router.post('/unit-kerja', unitKerjaController.createUnitKerja);

// --- RUTE BARU UNTUK UPDATE DAN DELETE ---
router.put('/unit-kerja/:id', unitKerjaController.updateUnitKerja);
router.delete('/unit-kerja/:id', unitKerjaController.deleteUnitKerja);

module.exports = router;