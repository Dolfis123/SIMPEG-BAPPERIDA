// models/Golongan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Golongan = sequelize.define('Golongan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    golongan_ruang: {
        type: DataTypes.STRING(10), // Contoh: 'III/a'
        allowNull: false,
        unique: true,
    },
    nama_pangkat: {
        type: DataTypes.STRING, // Contoh: 'Penata Muda'
        allowNull: false,
    }
}, {
    tableName: 'golongan',
    timestamps: false // Kita tidak perlu createdAt/updatedAt untuk tabel master ini
});

module.exports = Golongan;