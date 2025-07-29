// backend/models/RiwayatPangkat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RiwayatPangkat = sequelize.define('RiwayatPangkat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pegawai_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_golongan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nomor_sk: {
        type: DataTypes.STRING,
    },
    tanggal_sk: {
        type: DataTypes.DATEONLY,
    },
    tmt_pangkat: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    tableName: 'riwayat_pangkat',
    timestamps: true,
});

module.exports = RiwayatPangkat;