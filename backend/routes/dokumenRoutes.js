// backend/routes/dokumenRoutes.js
const express = require('express');
const router = express.Router();
const dokumenController = require('../controllers/dokumenController');
const upload = require('../middlewares/upload');

// Rute untuk mengunggah dokumen baru
router.post('/dokumen/upload', upload.single('file'), dokumenController.uploadDokumen);

// Rute untuk mendapatkan semua dokumen dari seorang pegawai
router.get('/dokumen/pegawai/:pegawaiId', dokumenController.getDokumenByPegawaiId);

// Rute untuk memperbarui kategori dokumen
router.put('/dokumen/:id', dokumenController.updateDokumen);

// Rute untuk menghapus dokumen
router.delete('/dokumen/:id', dokumenController.deleteDokumen);

router.put('/dokumen/:id/replace', upload.single('file'), dokumenController.replaceDokumen);

module.exports = router;