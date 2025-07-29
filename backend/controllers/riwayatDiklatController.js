// backend/controllers/riwayatDiklatController.js
const { RiwayatDiklat, Pegawai } = require('../models');

// Menambah data diklat baru untuk seorang pegawai
exports.createDiklat = async(req, res) => {
    try {
        const { pegawaiId } = req.params;
        const dataDiklat = {...req.body, pegawai_id: pegawaiId };

        const pegawai = await Pegawai.findByPk(pegawaiId);
        if (!pegawai) {
            return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
        }

        const newDiklat = await RiwayatDiklat.create(dataDiklat);
        res.status(201).json({
            message: 'Riwayat diklat berhasil ditambahkan.',
            data: newDiklat
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengambil semua riwayat diklat untuk seorang pegawai
exports.getAllDiklatByPegawaiId = async(req, res) => {
    try {
        const { pegawaiId } = req.params;
        const riwayatList = await RiwayatDiklat.findAll({
            where: { pegawai_id: pegawaiId },
            order: [
                ['tahun_diklat', 'DESC']
            ]
        });
        res.status(200).json({
            message: 'Data riwayat diklat berhasil diambil.',
            data: riwayatList
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengupdate satu data riwayat diklat
exports.updateDiklat = async(req, res) => {
    try {
        const { id } = req.params;
        const riwayat = await RiwayatDiklat.findByPk(id);

        if (!riwayat) {
            return res.status(404).json({ message: 'Data riwayat diklat tidak ditemukan.' });
        }

        await riwayat.update(req.body);
        res.status(200).json({
            message: 'Riwayat diklat berhasil diperbarui.',
            data: riwayat
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus satu data riwayat diklat
exports.deleteDiklat = async(req, res) => {
    try {
        const { id } = req.params;
        const riwayat = await RiwayatDiklat.findByPk(id);

        if (!riwayat) {
            return res.status(404).json({ message: 'Data riwayat diklat tidak ditemukan.' });
        }

        await riwayat.destroy();
        res.status(200).json({ message: 'Riwayat diklat berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};