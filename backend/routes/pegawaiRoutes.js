// routes/pegawaiRoutes.js
const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawaiController');

router.post('/pegawai', pegawaiController.createPegawai);
router.get('/pegawai', pegawaiController.getAllPegawai);
router.get('/pegawai/:id', pegawaiController.getPegawaiById);
router.put('/pegawai/:id', pegawaiController.updatePegawai);
router.delete('/pegawai/:id', pegawaiController.deletePegawai);
module.exports = router;