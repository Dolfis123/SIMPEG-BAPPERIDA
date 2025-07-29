// models/Dokumen.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dokumen = sequelize.define('Dokumen', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pegawai_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nama_file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    path_file: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kategori_dokumen: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diunggah_oleh: {
        type: DataTypes.INTEGER,
        allowNull: true, // Nanti diisi dengan id user yang login
    }
}, {
    tableName: 'dokumen',
    timestamps: true, // Otomatis menambah createdAt dan updatedAt
});

module.exports = Dokumen;