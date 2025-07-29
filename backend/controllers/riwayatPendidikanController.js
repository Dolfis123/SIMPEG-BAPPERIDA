// backend/controllers/riwayatPendidikanController.js
const { RiwayatPendidikan, Pegawai } = require('../models');

// Menambah data pendidikan baru untuk seorang pegawai
exports.createPendidikan = async(req, res) => {
    try {
        const { pegawaiId } = req.params;
        const dataPendidikan = {...req.body, pegawai_id: pegawaiId };

        // Validasi: Pastikan pegawai ada
        const pegawai = await Pegawai.findByPk(pegawaiId);
        if (!pegawai) {
            return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
        }

        const newPendidikan = await RiwayatPendidikan.create(dataPendidikan);
        res.status(201).json({
            message: 'Riwayat pendidikan berhasil ditambahkan.',
            data: newPendidikan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengambil semua riwayat pendidikan untuk seorang pegawai
exports.getAllPendidikanByPegawaiId = async(req, res) => {
    try {
        const { pegawaiId } = req.params;
        const riwayatList = await RiwayatPendidikan.findAll({
            where: { pegawai_id: pegawaiId },
            order: [
                ['tahun_lulus', 'DESC']
            ]
        });
        res.status(200).json({
            message: 'Data riwayat pendidikan berhasil diambil.',
            data: riwayatList
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengupdate satu data riwayat pendidikan
exports.updatePendidikan = async(req, res) => {
    try {
        const { id } = req.params; // ID dari riwayat pendidikan, bukan pegawai
        const riwayat = await RiwayatPendidikan.findByPk(id);

        if (!riwayat) {
            return res.status(404).json({ message: 'Data riwayat pendidikan tidak ditemukan.' });
        }

        await riwayat.update(req.body);
        res.status(200).json({
            message: 'Riwayat pendidikan berhasil diperbarui.',
            data: riwayat
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus satu data riwayat pendidikan
exports.deletePendidikan = async(req, res) => {
    try {
        const { id } = req.params; // ID dari riwayat pendidikan
        const riwayat = await RiwayatPendidikan.findByPk(id);

        if (!riwayat) {
            return res.status(404).json({ message: 'Data riwayat pendidikan tidak ditemukan.' });
        }

        await riwayat.destroy();
        res.status(200).json({ message: 'Riwayat pendidikan berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};