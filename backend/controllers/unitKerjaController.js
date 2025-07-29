// backend/controllers/unitKerjaController.js
// const UnitKerja = require('../models/UnitKerja');
const { UnitKerja, Pegawai } = require('../models'); // <-- Tambahkan Pegawai

/**
 * Fungsi untuk membuat Unit Kerja baru.
 * Termasuk pengecekan untuk memastikan 'nama_unit_kerja' belum ada di database.
 */
exports.createUnitKerja = async(req, res) => {
    try {
        const { nama_unit_kerja, id_induk } = req.body;

        // 1. Cek apakah nama_unit_kerja sudah ada
        const existingUnitKerja = await UnitKerja.findOne({
            where: {
                nama_unit_kerja: nama_unit_kerja
            }
        });

        // 2. Jika sudah ada, kirim respons error yang informatif
        if (existingUnitKerja) {
            return res.status(409).json({
                message: `Gagal menambahkan. Unit Kerja dengan nama '${nama_unit_kerja}' sudah terdaftar.`
            });
        }

        // 3. Jika belum ada, buat Unit Kerja baru
        const newUnitKerja = await UnitKerja.create({ nama_unit_kerja, id_induk });
        res.status(201).json({
            message: 'Unit Kerja berhasil dibuat',
            data: newUnitKerja
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fungsi untuk mengupdate Unit Kerja berdasarkan ID.
 * Termasuk pengecekan untuk memastikan 'nama_unit_kerja' yang baru tidak duplikat
 * dengan data unit kerja lainnya.
 */
exports.updateUnitKerja = async(req, res) => {
    try {
        const { id } = req.params;
        const { nama_unit_kerja, id_induk } = req.body;

        // 1. Cari Unit Kerja yang akan diupdate
        const unitKerja = await UnitKerja.findByPk(id);
        if (!unitKerja) {
            return res.status(404).json({ message: 'Unit Kerja tidak ditemukan' });
        }

        // 2. Cek duplikasi HANYA JIKA 'nama_unit_kerja' diubah
        if (nama_unit_kerja && nama_unit_kerja !== unitKerja.nama_unit_kerja) {
            const existingUnitKerja = await UnitKerja.findOne({
                where: {
                    nama_unit_kerja: nama_unit_kerja
                }
            });

            // 3. Jika nama sudah digunakan oleh data lain, kirim error
            if (existingUnitKerja) {
                return res.status(409).json({
                    message: `Gagal memperbarui. Nama Unit Kerja '${nama_unit_kerja}' sudah digunakan.`
                });
            }
        }

        // 4. Jika aman, lakukan update
        unitKerja.nama_unit_kerja = nama_unit_kerja;
        unitKerja.id_induk = id_induk;
        await unitKerja.save();

        res.status(200).json({
            message: 'Unit Kerja berhasil diperbarui',
            data: unitKerja
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUnitKerja = async(req, res) => {
    try {
        const allUnitKerja = await UnitKerja.findAll();
        res.status(200).json({
            message: 'Berhasil mendapatkan semua data unit kerja',
            data: allUnitKerja
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- FUNGSI BARU UNTUK UPDATE UNIT KERJA ---


// --- FUNGSI DELETE YANG DIPERBARUI ---
exports.deleteUnitKerja = async(req, res) => {
    try {
        const { id } = req.params;

        // 1. Cek apakah unit kerja ini masih digunakan oleh pegawai
        const usageCount = await Pegawai.count({ where: { id_unit_kerja: id } });
        if (usageCount > 0) {
            return res.status(409).json({
                message: `Unit Kerja ini tidak dapat dihapus karena masih digunakan oleh ${usageCount} pegawai.`
            });
        }

        // 2. Cek apakah unit kerja ini menjadi induk bagi unit lain
        const childUnit = await UnitKerja.findOne({ where: { id_induk: id } });
        if (childUnit) {
            return res.status(409).json({
                message: 'Unit Kerja ini tidak dapat dihapus karena menjadi induk bagi unit kerja lain.'
            });
        }

        // 3. Jika aman, baru hapus
        const unitKerja = await UnitKerja.findByPk(id);
        if (!unitKerja) {
            return res.status(404).json({ message: 'Unit Kerja tidak ditemukan' });
        }
        await unitKerja.destroy();
        res.status(200).json({ message: 'Unit Kerja berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};