// backend/controllers/jabatanController.js
const { Jabatan, Pegawai } = require('../models');

// Fungsi untuk membuat jabatan baru (dengan eselon)
exports.createJabatan = async(req, res) => {
    try {
        const { nama_jabatan, jenis_jabatan, eselon } = req.body;
        const newJabatan = await Jabatan.create({ nama_jabatan, jenis_jabatan, eselon });
        res.status(201).json({ message: 'Jabatan berhasil dibuat', data: newJabatan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mengambil semua data jabatan
exports.getAllJabatan = async(req, res) => {
    try {
        const allJabatan = await Jabatan.findAll({
            order: [
                ['nama_jabatan', 'ASC']
            ]
        });
        res.status(200).json({ message: 'Berhasil mendapatkan data jabatan', data: allJabatan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk mengupdate jabatan (dengan eselon)
exports.updateJabatan = async(req, res) => {
    try {
        const { id } = req.params;
        const { nama_jabatan, jenis_jabatan, eselon } = req.body;
        const jabatan = await Jabatan.findByPk(id);
        if (!jabatan) {
            return res.status(404).json({ message: 'Jabatan tidak ditemukan' });
        }
        await jabatan.update({ nama_jabatan, jenis_jabatan, eselon });
        res.status(200).json({ message: 'Jabatan berhasil diperbarui', data: jabatan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk menghapus jabatan
exports.deleteJabatan = async(req, res) => {
    try {
        const { id } = req.params;
        const usageCount = await Pegawai.count({ where: { id_jabatan: id } });
        if (usageCount > 0) {
            return res.status(409).json({
                message: `Jabatan tidak dapat dihapus karena masih digunakan oleh ${usageCount} pegawai.`
            });
        }
        const jabatan = await Jabatan.findByPk(id);
        if (!jabatan) {
            return res.status(404).json({ message: 'Jabatan tidak ditemukan' });
        }
        await jabatan.destroy();
        res.status(200).json({ message: 'Jabatan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};