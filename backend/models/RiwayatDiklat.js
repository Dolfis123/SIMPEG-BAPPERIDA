// backend/models/RiwayatDiklat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RiwayatDiklat = sequelize.define('RiwayatDiklat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pegawai_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nama_diklat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    penyelenggara: {
        type: DataTypes.STRING,
    },
    tahun_diklat: {
        type: DataTypes.STRING(4),
        allowNull: false,
    },
    jumlah_jam: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'riwayat_diklat',
    timestamps: true
});

module.exports = RiwayatDiklat;