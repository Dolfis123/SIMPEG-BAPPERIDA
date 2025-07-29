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

/**
 * Fungsi untuk membuat Golongan baru dengan pengecekan duplikasi.
 * Akan memeriksa apakah 'golongan_ruang' sudah ada di database.
 */
exports.createGolongan = async(req, res) => {
    try {
        // Ambil data dari body request
        const { golongan_ruang, nama_pangkat } = req.body;

        // 1. Cari apakah golongan_ruang sudah ada di database
        const existingGolongan = await Golongan.findOne({
            where: {
                golongan_ruang: golongan_ruang
            }
        });

        // 2. Jika sudah ada, kirimkan respons error yang informatif
        if (existingGolongan) {
            // Menggunakan status 409 (Conflict) yang lebih sesuai untuk duplikasi data
            return res.status(409).json({
                message: `Gagal menambahkan data. Golongan/Ruang '${golongan_ruang}' sudah terdaftar di sistem.`
            });
        }

        // 3. Jika belum ada, buat data Golongan yang baru
        const newGolongan = await Golongan.create({ golongan_ruang, nama_pangkat });

        // Kirim respons sukses
        res.status(201).json({
            message: 'Golongan berhasil dibuat',
            data: newGolongan
        });

    } catch (error) {
        // Tangani error server
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fungsi untuk mengupdate data Golongan berdasarkan ID.
 * Termasuk pengecekan untuk memastikan 'golongan_ruang' yang baru tidak duplikat
 * dengan data golongan lainnya yang sudah ada.
 */
exports.updateGolongan = async(req, res) => {
    try {
        // Ambil ID dari parameter URL
        const { id } = req.params;
        // Ambil data baru dari body request
        const { golongan_ruang, nama_pangkat } = req.body;

        // 1. Cari data golongan yang akan diupdate berdasarkan ID-nya
        const golongan = await Golongan.findByPk(id);

        // Jika data dengan ID tersebut tidak ditemukan, kirim error 404
        if (!golongan) {
            return res.status(404).json({ message: 'Data Golongan tidak ditemukan.' });
        }

        // 2. Lakukan pengecekan duplikasi HANYA JIKA 'golongan_ruang' diubah
        if (golongan_ruang && golongan_ruang !== golongan.golongan_ruang) {
            // Cari apakah ada data LAIN yang sudah menggunakan 'golongan_ruang' yang baru
            const existingGolongan = await Golongan.findOne({
                where: {
                    golongan_ruang: golongan_ruang
                }
            });

            // 3. Jika ditemukan data lain yang sama, kirim respons error yang informatif
            if (existingGolongan) {
                return res.status(409).json({
                    message: `Gagal memperbarui data. Golongan/Ruang '${golongan_ruang}' sudah digunakan oleh data lain.`
                });
            }
        }

        // 4. Jika tidak ada duplikasi (atau jika golongan_ruang tidak diubah), update data
        golongan.golongan_ruang = golongan_ruang;
        golongan.nama_pangkat = nama_pangkat;
        await golongan.save(); // Simpan perubahan ke database

        // Kirim respons sukses
        res.status(200).json({
            message: 'Golongan berhasil diperbarui',
            data: golongan
        });

    } catch (error) {
        // Tangani jika ada error server
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