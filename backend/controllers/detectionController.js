// backend/controllers/detectionController.js
const { Pegawai, KinerjaSKP, Golongan, Jabatan, UnitKerja } = require('../models');
const { Op } = require('sequelize');

exports.findPotentialCandidates = async(req, res) => {
    try {
        const today = new Date();

        // --- LOGIKA DETEKSI KGB ---
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(today.getFullYear() - 2);

        const potentialKGB = await Pegawai.findAll({
            where: {
                tmt_kgb_terakhir: {
                    [Op.lte]: twoYearsAgo
                },
                status_pegawai: 'Aktif'
            },
            attributes: ['id', 'nip', 'nama_lengkap', 'tmt_kgb_terakhir'],
            // --- PERBAIKAN DI SINI: Tambahkan alias 'as' ---
            include: [{ model: Jabatan, as: 'Jabatan', attributes: ['nama_jabatan'] }]
        });

        // --- LOGIKA DETEKSI KP REGULER ---
        const fourYearsAgo = new Date();
        fourYearsAgo.setFullYear(today.getFullYear() - 4);
        const lastTwoYears = [today.getFullYear() - 1, today.getFullYear() - 2];

        const timeEligiblePegawai = await Pegawai.findAll({
            where: {
                tmt_pangkat_terakhir: {
                    [Op.lte]: fourYearsAgo
                },
                status_pegawai: 'Aktif'
            },
            attributes: ['id', 'nip', 'nama_lengkap', 'tmt_pangkat_terakhir'],
            // --- PERBAIKAN DI SINI: Tambahkan alias 'as' ---
            include: [{ model: Jabatan, as: 'Jabatan', attributes: ['nama_jabatan'] }]
        });

        const potentialKP = [];
        for (const pegawai of timeEligiblePegawai) {
            const skpRecords = await KinerjaSKP.findAll({
                where: {
                    pegawai_id: pegawai.id,
                    tahun_penilaian: {
                        [Op.in]: lastTwoYears
                    },
                    predikat_kinerja: {
                        [Op.in]: ['Baik', 'Sangat Baik']
                    }
                },
                limit: 2
            });

            if (skpRecords.length >= 2) {
                potentialKP.push(pegawai);
            }
        }

        res.status(200).json({
            message: 'Deteksi berhasil',
            data: {
                potentialKGB,
                potentialKP
            }
        });

    } catch (error) {
        console.error("Error in findPotentialCandidates:", error); // Log error untuk debugging
        res.status(500).json({ message: 'Terjadi kesalahan saat melakukan deteksi', error: error.message });
    }
};