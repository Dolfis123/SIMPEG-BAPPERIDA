// backend/controllers/dokumenController.js
const { Dokumen } = require('../models');
const fs = require('fs'); // Modul 'fs' (File System) dari Node.js untuk mengelola file
const path = require('path'); // Modul 'path' untuk mengelola path file

// Fungsi untuk mengunggah dokumen baru
exports.uploadDokumen = async(req, res) => {
    try {
        const { pegawai_id, kategori_dokumen } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
        }

        const newDokumen = await Dokumen.create({
            pegawai_id: pegawai_id,
            kategori_dokumen: kategori_dokumen,
            nama_file: req.file.originalname,
            path_file: req.file.path,
            // diunggah_oleh: req.user.id // Nanti bisa diaktifkan jika ingin melacak pengunggah
        });

        res.status(201).json({
            message: 'Dokumen berhasil diunggah',
            data: newDokumen
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mendapatkan semua dokumen milik seorang pegawai
exports.getDokumenByPegawaiId = async(req, res) => {
    try {
        const { pegawaiId } = req.params;
        const allDokumen = await Dokumen.findAll({
            where: { pegawai_id: pegawaiId },
            order: [
                    ['createdAt', 'DESC']
                ] // Urutkan dari yang terbaru
        });
        res.status(200).json({
            message: `Berhasil mendapatkan semua dokumen untuk pegawai id ${pegawaiId}`,
            data: allDokumen
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk memperbarui kategori dokumen
exports.updateDokumen = async(req, res) => {
    try {
        const { id } = req.params;
        const { kategori_dokumen } = req.body;

        const dokumen = await Dokumen.findByPk(id);
        if (!dokumen) {
            return res.status(404).json({ message: 'Dokumen tidak ditemukan' });
        }

        dokumen.kategori_dokumen = kategori_dokumen;
        await dokumen.save();

        res.status(200).json({
            message: 'Kategori dokumen berhasil diperbarui',
            data: dokumen
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menghapus dokumen (catatan database & file fisik)
exports.deleteDokumen = async(req, res) => {
    try {
        const { id } = req.params;
        const dokumen = await Dokumen.findByPk(id);
        if (!dokumen) {
            return res.status(404).json({ message: 'Dokumen tidak ditemukan' });
        }

        // Hapus file fisik dari server untuk mencegah penumpukan file sampah
        const filePath = path.join(__dirname, '..', dokumen.path_file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Hapus catatan dari database
        await dokumen.destroy();
        res.status(200).json({ message: 'Dokumen berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// --- FUNGSI BARU UNTUK MENGGANTI FILE DOKUMEN ---
exports.replaceDokumen = async(req, res) => {
    try {
        const { id } = req.params;

        const dokumen = await Dokumen.findByPk(id);
        if (!dokumen) {
            return res.status(404).json({ message: 'Dokumen tidak ditemukan' });
        }

        // Hapus file fisik yang lama
        const oldFilePath = path.join(__dirname, '..', dokumen.path_file);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }

        // Perbarui record di database dengan info file yang baru
        dokumen.nama_file = req.file.originalname;
        dokumen.path_file = req.file.path;
        // Kategori tidak diubah, tetap menggunakan yang lama
        await dokumen.save();

        res.status(200).json({
            message: 'File dokumen berhasil diganti',
            data: dokumen
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};