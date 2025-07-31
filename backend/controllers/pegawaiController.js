// backend/controllers/pegawaiController.js

const { Pegawai, Golongan, Jabatan, UnitKerja, RiwayatPendidikan, RiwayatDiklat, sequelize } = require('../models'); // 1. Impor sequelize
const { Op } = require('sequelize');

// Fungsi untuk membuat pegawai baru (dengan validasi NIP)
exports.createPegawai = async(req, res) => {
    try {
        const { nip } = req.body;
        const existingPegawai = await Pegawai.findOne({ where: { nip: nip } });
        if (existingPegawai) {
            return res.status(409).json({ message: `NIP ${nip} sudah terdaftar. Silakan gunakan NIP lain.` });
        }
        const newPegawai = await Pegawai.create(req.body);
        res.status(201).json({
            message: 'Pegawai berhasil ditambahkan',
            data: newPegawai
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mengupdate data pegawai (dengan validasi NIP)
exports.updatePegawai = async(req, res) => {
    try {
        const { id } = req.params;
        const { nip } = req.body;
        const existingPegawai = await Pegawai.findOne({
            where: {
                nip: nip,
                id: {
                    [Op.ne]: id
                }
            }
        });
        if (existingPegawai) {
            return res.status(409).json({ message: `NIP ${nip} sudah digunakan oleh pegawai lain.` });
        }
        const pegawai = await Pegawai.findByPk(id);
        if (!pegawai) {
            return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
        }
        await pegawai.update(req.body);
        res.status(200).json({
            message: 'Data pegawai berhasil diperbarui',
            data: pegawai
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- FUNGSI INI DIPERBARUI DENGAN LOGIKA PENGURUTAN ---
exports.getAllPegawai = async(req, res) => {
    try {
        const allPegawai = await Pegawai.findAll({
            include: [
                { model: Golongan, as: 'Golongan' },
                {
                    model: Jabatan,
                    as: 'Jabatan',
                    attributes: ['id', 'nama_jabatan', 'jenis_jabatan', 'eselon']
                },
                { model: UnitKerja, as: 'UnitKerja' },
                { model: RiwayatPendidikan, as: 'RiwayatPendidikan' },
                { model: RiwayatDiklat, as: 'RiwayatDiklat' }
            ],
            // 2. Tambahkan logika pengurutan di sini
            order: [
                // Urutkan berdasarkan unit kerja induk (atau diri sendiri jika induk)
                [sequelize.literal('COALESCE(`UnitKerja`.`id_induk`, `UnitKerja`.`id`)'), 'ASC'],
                // Kemudian urutkan berdasarkan unit kerja itu sendiri (agar sub-bagian berurutan)
                [sequelize.literal('`UnitKerja`.`id`'), 'ASC'],
                // Terakhir, urutkan pegawai di dalam unit kerja tersebut berdasarkan pangkat (seperti DUK)
                [{ model: Golongan, as: 'Golongan' }, 'id', 'DESC'],
                ['tmt_pangkat_terakhir', 'ASC']
            ]
        });
        res.status(200).json({
            message: 'Berhasil mendapatkan semua data pegawai',
            data: allPegawai
        });
    } catch (error) {
        console.error("Error di getAllPegawai:", error);
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mendapatkan detail satu pegawai
exports.getPegawaiById = async(req, res) => {
    try {
        const pegawai = await Pegawai.findByPk(req.params.id, {
            include: [
                { model: Golongan, as: 'Golongan' },
                {
                    model: Jabatan,
                    as: 'Jabatan',
                    attributes: ['id', 'nama_jabatan', 'jenis_jabatan', 'eselon']
                },
                { model: UnitKerja, as: 'UnitKerja' },
                { model: RiwayatPendidikan, as: 'RiwayatPendidikan' },
                { model: RiwayatDiklat, as: 'RiwayatDiklat' }
            ]
        });
        if (!pegawai) {
            return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
        }
        res.status(200).json({
            message: 'Detail pegawai berhasil didapatkan',
            data: pegawai
        });
    } catch (error) {
        console.error(`Error in getPegawaiById for id ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menghapus pegawai
exports.deletePegawai = async(req, res) => {
    try {
        const { id } = req.params;
        const pegawai = await Pegawai.findByPk(id);
        if (!pegawai) {
            return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
        }
        // Hapus juga data riwayat terkait
        await RiwayatPendidikan.destroy({ where: { pegawai_id: id } });
        await RiwayatDiklat.destroy({ where: { pegawai_id: id } });

        await pegawai.destroy();
        res.status(200).json({ message: 'Pegawai berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};