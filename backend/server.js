// backend/server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

// Impor semua file rute Anda
const golonganRoutes = require('./routes/golonganRoutes');
const jabatanRoutes = require('./routes/jabatanRoutes');
const unitKerjaRoutes = require('./routes/unitKerjaRoutes');
const pegawaiRoutes = require('./routes/pegawaiRoutes');
const dokumenRoutes = require('./routes/dokumenRoutes');
const kinerjaRoutes = require('./routes/kinerjaRoutes');
const usulanRoutes = require('./routes/usulanRoutes');
const userRoutes = require('./routes/userRoutes');
const detectionRoutes = require('./routes/detectionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // <-- Pastikan baris ini ada
const laporanRoutes = require('./routes/laporanRoutes'); // <-- TAMBAHKAN INI
const riwayatPendidikanRoutes = require('./routes/riwayatPendidikanRoutes');
const riwayatDiklatRoutes = require('./routes/riwayatDiklatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Gunakan semua rute Anda
app.use('/api', golonganRoutes);
app.use('/api', jabatanRoutes);
app.use('/api', unitKerjaRoutes);
app.use('/api', pegawaiRoutes);
app.use('/api', dokumenRoutes);
app.use('/api', kinerjaRoutes);
app.use('/api', usulanRoutes);
app.use('/api', userRoutes);
app.use('/api', detectionRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', laporanRoutes);
app.use('/api', riwayatPendidikanRoutes);
app.use('/api', riwayatDiklatRoutes);
// Fungsi untuk menjalankan server
const startServer = async() => {
    try {
        await sequelize.authenticate();
        console.log('Koneksi database berhasil.');

        await sequelize.sync({ force: false });
        console.log('Semua model telah disinkronisasi.');

        app.listen(PORT, () => {
            console.log(`Server berjalan di port ${PORT}`);
        });
    } catch (error) {
        console.error('Tidak dapat terhubung ke database:', error);
    }
};

startServer();