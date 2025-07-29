// backend/controllers/laporanController.js
const { Pegawai, Golongan, Jabatan } = require('../models');
const { sequelize } = require('../models'); // Impor instance sequelize

// Fungsi untuk menghasilkan data Daftar Urut Kepangkatan (DUK)
exports.getDUK = async(req, res) => {
    try {
        const dukData = await Pegawai.findAll({
            where: { status_pegawai: 'Aktif' },
            include: [
                { model: Golongan, as: 'Golongan' },
                { model: Jabatan, as: 'Jabatan' }
            ],
            // Aturan pengurutan DUK:
            // 1. Pangkat/Golongan (tertinggi ke terendah)
            // 2. TMT Pangkat (paling lama ke paling baru)
            // 3. Masa Kerja (paling lama ke paling baru - diwakili TMT PNS/CPNS)
            // 4. Usia (paling tua ke paling muda)
            // 5. Nama (alfabetis)
            order: [
                [sequelize.col('Golongan.golongan_ruang'), 'DESC'],
                ['tmt_pangkat_terakhir', 'ASC'],
                ['tmt_pns', 'ASC'],
                ['tanggal_lahir', 'ASC'],
                ['nama_lengkap', 'ASC']
            ]
        });

        res.status(200).json({
            message: 'Data DUK berhasil diambil',
            data: dukData
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data DUK', error: error.message });
    }
};