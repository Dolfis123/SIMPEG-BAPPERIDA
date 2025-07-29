// models/Jabatan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jabatan = sequelize.define('Jabatan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nama_jabatan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    jenis_jabatan: {
        type: DataTypes.ENUM('Struktural', 'Fungsional', 'Pelaksana'),
        allowNull: false,
    },
    eselon: {
        type: DataTypes.STRING, // Contoh: 'II.a', 'III.b', 'IV.a'
        allowNull: true, // Boleh null karena tidak semua jabatan memiliki eselon
    },
}, {
    tableName: 'jabatan',
    timestamps: false
});

module.exports = Jabatan;