// backend/controllers/dashboardController.js
const { Pegawai, UsulanKpKgb, Golongan, UnitKerja, KinerjaSKP, Jabatan, RiwayatPendidikan, RiwayatDiklat } = require('../models');
const { Op } = require('sequelize');

// Fungsi untuk kartu statistik di dashboard utama
exports.getDashboardStats = async(req, res) => {
    try {
        const totalPegawai = await Pegawai.count({ where: { status_pegawai: 'Aktif' } });
        const usulanDiproses = await UsulanKpKgb.count({ where: { status_usulan: 'Diajukan' } });
        const usulanDisetujui = await UsulanKpKgb.count({ where: { status_usulan: 'Disetujui' } });

        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        const peringatanKGB = await Pegawai.count({
            where: {
                tmt_kgb_terakhir: {
                    [Op.lte]: twoYearsAgo
                },
                status_pegawai: 'Aktif'
            }
        });

        res.status(200).json({ totalPegawai, usulanDiproses, usulanDisetujui, peringatanKGB });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil statistik dashboard', error: error.message });
    }
};

// Fungsi canggih untuk semua data di Halaman Analitik
exports.getFullAnalytics = async(req, res) => {
    try {
        const allPegawai = await Pegawai.findAll({
            where: { status_pegawai: 'Aktif' },
            include: [
                { model: Golongan, as: 'Golongan', attributes: ['golongan_ruang'] },
                { model: Jabatan, as: 'Jabatan', attributes: ['nama_jabatan'] },
                { model: UnitKerja, as: 'UnitKerja', attributes: ['nama_unit_kerja'] },
                { model: RiwayatPendidikan, as: 'RiwayatPendidikan', attributes: ['tingkat_pendidikan'] }
            ],
            attributes: ['id', 'jenis_kelamin', 'tanggal_lahir', 'status_kepegawaian', 'tmt_pns', 'tmt_cpns'],
        });

        const currentYear = new Date().getFullYear();

        // Inisialisasi objek untuk menampung hasil analitik
        const genderAnalytics = { 'Laki-laki': 0, 'Perempuan': 0 };
        const golonganAnalytics = {};
        const pendidikanAnalytics = {};
        const ageAnalytics = { '20-29': 0, '30-39': 0, '40-49': 0, '50-59': 0, '60+': 0 };
        const masaKerjaAnalytics = { '0-5 thn': 0, '6-15 thn': 0, '16-25 thn': 0, '25+ thn': 0 };
        const unitKerjaAnalytics = {};
        const statusKepegawaianAnalytics = {};

        // Helper untuk mencari pendidikan tertinggi
        const getHighestEducation = (riwayat) => {
            if (!riwayat || riwayat.length === 0) return null;
            const levels = { 'S3': 5, 'S2': 4, 'S1': 3, 'D4': 3, 'D3': 2, 'SMA': 1 };
            return riwayat.reduce((highest, current) => {
                const currentScore = levels[current.tingkat_pendidikan.toUpperCase()] || 0;
                const highestScore = highest ? (levels[highest.tingkat_pendidikan.toUpperCase()] || 0) : 0;
                return currentScore > highestScore ? current : highest;
            }, null);
        };

        // Loop melalui semua pegawai untuk mengagregasi data
        allPegawai.forEach(p => {
            // Analitik Gender
            if (p.jenis_kelamin) genderAnalytics[p.jenis_kelamin]++;

            // Analitik Golongan
            if (p.Golongan && p.Golongan.golongan_ruang) {
                golonganAnalytics[p.Golongan.golongan_ruang] = (golonganAnalytics[p.Golongan.golongan_ruang] || 0) + 1;
            }

            // Analitik Pendidikan
            const pendidikanTertinggi = getHighestEducation(p.RiwayatPendidikan);
            if (pendidikanTertinggi) {
                const tingkat = pendidikanTertinggi.tingkat_pendidikan;
                pendidikanAnalytics[tingkat] = (pendidikanAnalytics[tingkat] || 0) + 1;
            }

            // Analitik Usia
            if (p.tanggal_lahir) {
                const age = currentYear - new Date(p.tanggal_lahir).getFullYear();
                if (age <= 29) ageAnalytics['20-29']++;
                else if (age <= 39) ageAnalytics['30-39']++;
                else if (age <= 49) ageAnalytics['40-49']++;
                else if (age <= 59) ageAnalytics['50-59']++;
                else ageAnalytics['60+']++;
            }

            // Analitik Masa Kerja
            const tmt = p.tmt_pns || p.tmt_cpns;
            if (tmt) {
                const masaKerja = currentYear - new Date(tmt).getFullYear();
                if (masaKerja <= 5) masaKerjaAnalytics['0-5 thn']++;
                else if (masaKerja <= 15) masaKerjaAnalytics['6-15 thn']++;
                else if (masaKerja <= 25) masaKerjaAnalytics['16-25 thn']++;
                else masaKerjaAnalytics['25+ thn']++;
            }

            // Analitik Unit Kerja
            const namaUnit = (p.UnitKerja && p.UnitKerja.nama_unit_kerja) ? p.UnitKerja.nama_unit_kerja : 'Tidak Diketahui';
            unitKerjaAnalytics[namaUnit] = (unitKerjaAnalytics[namaUnit] || 0) + 1;

            // Analitik Status Kepegawaian
            const status = p.status_kepegawaian || 'Tidak Diketahui';
            statusKepegawaianAnalytics[status] = (statusKepegawaianAnalytics[status] || 0) + 1;
        });

        // Analitik Kinerja (SKP) Tahun Terakhir
        const skpAnalytics = {};
        const lastYearSKP = await KinerjaSKP.findAll({ where: { tahun_penilaian: currentYear - 1 } });
        lastYearSKP.forEach(skp => {
            const predikat = skp.predikat_kinerja;
            skpAnalytics[predikat] = (skpAnalytics[predikat] || 0) + 1;
        });

        const formatForChart = (dataObject) => Object.entries(dataObject).map(([name, value]) => ({ name, value }));

        res.status(200).json({
            gender: formatForChart(genderAnalytics),
            age: formatForChart(ageAnalytics),
            golongan: formatForChart(golonganAnalytics).sort((a, b) => a.name.localeCompare(b.name)),
            unitKerja: formatForChart(unitKerjaAnalytics),
            statusKepegawaian: formatForChart(statusKepegawaianAnalytics),
            masaKerja: formatForChart(masaKerjaAnalytics),
            kinerja: formatForChart(skpAnalytics),
            pendidikan: formatForChart(pendidikanAnalytics),
        });

    } catch (error) {
        console.error("Error in getFullAnalytics:", error);
        res.status(500).json({ message: 'Gagal mengambil data analitik', error: error.message });
    }
};