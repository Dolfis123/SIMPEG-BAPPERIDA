// backend/controllers/kinerjaController.js
const { KinerjaSKP, Pegawai } = require('../models');
const { Op } = require('sequelize'); // Impor Operator Sequelize

// Fungsi untuk menambahkan catatan kinerja baru (dengan validasi)
exports.addKinerja = async(req, res) => {
    try {
        const { pegawai_id, tahun_penilaian } = req.body;

        // CEK DUPLIKAT: Periksa apakah sudah ada catatan untuk pegawai & tahun yang sama
        const existingRecord = await KinerjaSKP.findOne({
            where: {
                pegawai_id: pegawai_id,
                tahun_penilaian: tahun_penilaian
            }
        });

        if (existingRecord) {
            return res.status(409).json({ message: `Data SKP untuk tahun ${tahun_penilaian} bagi pegawai ini sudah ada.` });
        }

        const newKinerja = await KinerjaSKP.create(req.body);
        res.status(201).json({
            message: 'Catatan kinerja berhasil ditambahkan',
            data: newKinerja
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mendapatkan semua riwayat kinerja
exports.getAllKinerja = async(req, res) => {
    try {
        const allKinerja = await KinerjaSKP.findAll({
            include: [{
                model: Pegawai,
                attributes: ['nama_lengkap', 'nip']
            }],
            order: [
                ['tahun_penilaian', 'DESC']
            ]
        });
        res.status(200).json({
            message: 'Berhasil mendapatkan semua riwayat kinerja',
            data: allKinerja
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mengupdate catatan kinerja (dengan validasi)
exports.updateKinerja = async(req, res) => {
    try {
        const { id } = req.params;
        const { pegawai_id, tahun_penilaian } = req.body;

        // CEK DUPLIKAT: Periksa apakah tahun yang baru sudah ada untuk pegawai yang sama,
        // kecuali untuk data yang sedang diedit itu sendiri.
        const existingRecord = await KinerjaSKP.findOne({
            where: {
                pegawai_id: pegawai_id,
                tahun_penilaian: tahun_penilaian,
                id: {
                    [Op.ne]: id
                } // [Op.ne] artinya "not equal" atau "tidak sama dengan"
            }
        });

        if (existingRecord) {
            return res.status(409).json({ message: `Data SKP untuk tahun ${tahun_penilaian} bagi pegawai ini sudah ada.` });
        }

        const kinerja = await KinerjaSKP.findByPk(id);
        if (!kinerja) {
            return res.status(404).json({ message: 'Catatan kinerja tidak ditemukan' });
        }
        await kinerja.update(req.body);
        res.status(200).json({
            message: 'Catatan kinerja berhasil diperbarui',
            data: kinerja
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menghapus catatan kinerja
exports.deleteKinerja = async(req, res) => {
    try {
        const { id } = req.params;
        const kinerja = await KinerjaSKP.findByPk(id);
        if (!kinerja) {
            return res.status(404).json({ message: 'Catatan kinerja tidak ditemukan' });
        }
        await kinerja.destroy();
        res.status(200).json({ message: 'Catatan kinerja berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};