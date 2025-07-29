// models/UnitKerja.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UnitKerja = sequelize.define('UnitKerja', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nama_unit_kerja: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // Kolom ini opsional, tapi sangat berguna untuk membuat struktur hierarki
    // Misalnya, Sub-Bagian di bawah Bagian.
    id_induk: {
        type: DataTypes.INTEGER,
        allowNull: true, // Boleh kosong jika ini adalah unit kerja paling atas
        references: {
            model: 'unit_kerja', // Merujuk ke tabel ini sendiri
            key: 'id'
        }
    }
}, {
    tableName: 'unit_kerja',
    timestamps: false
});

module.exports = UnitKerja;