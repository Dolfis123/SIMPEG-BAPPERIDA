// backend/controllers/usulanController.js
const { UsulanKpKgb, Pegawai, Golongan, Jabatan, User, UnitKerja } = require('../models');
const { Op } = require('sequelize');

// Fungsi untuk mengambil semua usulan (digunakan oleh Dashboard dan halaman Proses Usulan)
exports.getAllUsulan = async(req, res) => {
    try {
        const { limit, status } = req.query;
        const whereClause = {};

        if (status) {
            whereClause.status_usulan = status;
        }

        const options = {
            where: whereClause,
            include: [{
                    model: Pegawai,
                    as: 'Pegawai', // Menggunakan alias yang benar
                    attributes: ['id', 'nip', 'nama_lengkap'],
                    include: [
                        { model: Golongan, as: 'Golongan', attributes: ['golongan_ruang'] },
                        { model: Jabatan, as: 'Jabatan', attributes: ['nama_jabatan'] }
                    ]
                },
                {
                    model: User,
                    as: 'pembuat',
                    attributes: ['id', 'username', 'role']
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        };

        if (limit) {
            options.limit = parseInt(limit, 10);
        }

        const allUsulan = await UsulanKpKgb.findAll(options);

        res.status(200).json({
            message: 'Berhasil mendapatkan data usulan',
            data: allUsulan
        });
    } catch (error) {
        console.error("Error in getAllUsulan:", error);
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mendapatkan detail satu usulan
exports.getUsulanById = async(req, res) => {
    try {
        const { id } = req.params;
        const usulan = await UsulanKpKgb.findByPk(id, {
            include: [{
                    model: Pegawai,
                    as: 'Pegawai',
                    include: [
                        { model: Golongan, as: 'Golongan' },
                        { model: Jabatan, as: 'Jabatan' },
                        { model: UnitKerja, as: 'UnitKerja' }
                    ]
                },
                {
                    model: User,
                    as: 'pembuat',
                    attributes: ['username']
                },
                {
                    model: User,
                    as: 'verifikator',
                    attributes: ['username']
                }
            ]
        });

        if (!usulan) {
            return res.status(404).json({ message: 'Usulan tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Berhasil mendapatkan detail usulan',
            data: usulan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Fungsi untuk membuat usulan baru
exports.createUsulan = async(req, res) => {
    try {
        // Asumsi 'diajukan_oleh' didapat dari user yang sedang login (via token)
        const diajukan_oleh = req.user.id;
        const newUsulan = await UsulanKpKgb.create({...req.body, diajukan_oleh });
        res.status(201).json({
            message: 'Usulan berhasil dibuat.',
            data: newUsulan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk update status usulan
exports.updateStatusUsulan = async(req, res) => {
    try {
        const { id } = req.params;
        const { status_usulan, catatan_verifikator } = req.body;
        // Asumsi 'diverifikasi_oleh' didapat dari user yang sedang login (verifikator)
        const diverifikasi_oleh = req.user.id;

        const usulan = await UsulanKpKgb.findByPk(id);
        if (!usulan) {
            return res.status(404).json({ message: 'Usulan tidak ditemukan.' });
        }

        usulan.status_usulan = status_usulan;
        usulan.catatan_verifikator = catatan_verifikator;
        usulan.tanggal_verifikasi = new Date();
        usulan.diverifikasi_oleh = diverifikasi_oleh;

        await usulan.save();

        res.status(200).json({
            message: `Status usulan berhasil diubah menjadi ${status_usulan}.`,
            data: usulan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menghapus usulan (jika diperlukan)
exports.deleteUsulan = async(req, res) => {
    try {
        const { id } = req.params;
        const usulan = await UsulanKpKgb.findByPk(id);

        if (!usulan) {
            return res.status(404).json({ message: 'Usulan tidak ditemukan.' });
        }

        // Tambahkan logika otorisasi jika perlu, misal hanya pembuat atau admin yang bisa menghapus
        // if (req.user.id !== usulan.diajukan_oleh && req.user.role !== 'super_admin') {
        //     return res.status(403).json({ message: 'Anda tidak memiliki izin untuk menghapus usulan ini.' });
        // }

        await usulan.destroy();
        res.status(200).json({ message: 'Usulan berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};