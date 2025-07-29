// backend/models/RiwayatPendidikan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RiwayatPendidikan = sequelize.define('RiwayatPendidikan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pegawai_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tingkat_pendidikan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jurusan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nama_sekolah: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tahun_lulus: {
        type: DataTypes.STRING(4),
        allowNull: false,
    }
}, {
    tableName: 'riwayat_pendidikan',
    timestamps: true
});

module.exports = RiwayatPendidikan;