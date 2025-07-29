// models/KinerjaSKP.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KinerjaSKP = sequelize.define('KinerjaSKP', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pegawai_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tahun_penilaian: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    predikat_kinerja: {
        type: DataTypes.ENUM('Sangat Baik', 'Baik', 'Butuh Perbaikan', 'Kurang', 'Sangat Kurang'),
        allowNull: false,
    },
    // Opsional: untuk menautkan ke file SKP yang sudah di-scan
    dokumen_skp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'kinerja_skp',
    timestamps: true
});

module.exports = KinerjaSKP;