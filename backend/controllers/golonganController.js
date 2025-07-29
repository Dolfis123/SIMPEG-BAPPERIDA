// backend/controllers/golonganController.js
const { Golongan, Pegawai } = require('../models'); // <-- PERBAIKAN: Impor model Pegawai
const Sequelize = require('sequelize');

exports.getAllGolongan = async(req, res) => {
    try {
        const allGolongan = await Golongan.findAll({
            order: [
                [Sequelize.literal("SUBSTRING_INDEX(golongan_ruang, '/', 1)"), 'ASC'],
                [Sequelize.literal("SUBSTRING_INDEX(golongan_ruang, '/', -1)"), 'ASC']
            ]
        });
        res.status(200).json({
            message: 'Berhasil mendapatkan semua data golongan',
            data: allGolongan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGolongan = async(req, res) => {
    try {
        const { golongan_ruang, nama_pangkat } = req.body;
        const newGolongan = await Golongan.create({ golongan_ruang, nama_pangkat });
        res.status(201).json({
            message: 'Golongan berhasil dibuat',
            data: newGolongan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateGolongan = async(req, res) => {
    try {
        const { id } = req.params;
        const { golongan_ruang, nama_pangkat } = req.body;
        const golongan = await Golongan.findByPk(id);
        if (!golongan) {
            return res.status(404).json({ message: 'Golongan tidak ditemukan' });
        }
        golongan.golongan_ruang = golongan_ruang;
        golongan.nama_pangkat = nama_pangkat;
        await golongan.save();
        res.status(200).json({
            message: 'Golongan berhasil diperbarui',
            data: golongan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGolongan = async(req, res) => {
    try {
        const { id } = req.params;

        // 1. Cek apakah golongan ini masih digunakan (Sekarang 'Pegawai' sudah dikenali)
        const usageCount = await Pegawai.count({ where: { id_golongan: id } });
        if (usageCount > 0) {
            return res.status(409).json({ // 409 Conflict
                message: `Golongan tidak dapat dihapus karena masih digunakan oleh ${usageCount} pegawai.`
            });
        }

        // 2. Jika tidak digunakan, baru hapus
        const golongan = await Golongan.findByPk(id);
        if (!golongan) {
            return res.status(404).json({ message: 'Golongan tidak ditemukan' });
        }
        await golongan.destroy();
        res.status(200).json({ message: 'Golongan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};