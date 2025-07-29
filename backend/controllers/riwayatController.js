// backend/controllers/riwayatController.js
const { RiwayatPangkat, Golongan } = require('../models');

// Fungsi untuk mendapatkan riwayat pangkat seorang pegawai
exports.getRiwayatPangkat = async(req, res) => {
    try {
        const { pegawaiId } = req.params;
        const riwayat = await RiwayatPangkat.findAll({
            where: { pegawai_id: pegawaiId },
            include: [{
                model: Golongan, // Sertakan data detail golongan
                attributes: ['golongan_ruang', 'nama_pangkat']
            }],
            order: [
                    ['tmt_pangkat', 'DESC']
                ] // Urutkan dari yang terbaru
        });
        res.status(200).json({ data: riwayat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};