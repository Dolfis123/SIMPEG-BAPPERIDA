// models/UsulanKpKgb.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsulanKpKgb = sequelize.define('UsulanKpKgb', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pegawai_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jenis_usulan: {
        type: DataTypes.ENUM('KP Reguler', 'KP Pilihan', 'KGB'),
        allowNull: false,
    },
    sub_jenis_kp_pilihan: {
        type: DataTypes.ENUM('Prestasi', 'Ijazah', 'Jabatan', 'Pengabdian', 'Anumerta', 'Cacat Dinas', 'Tugas Belajar', 'Penemuan Baru'),
        allowNull: true, // Hanya diisi jika jenis_usulan adalah 'KP Pilihan'
    },
    tanggal_usulan: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    status_usulan: {
        type: DataTypes.ENUM('Draft', 'Diajukan', 'Disetujui', 'Ditolak', 'Selesai'),
        defaultValue: 'Draft',
    },
    catatan_verifikator: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    diajukan_oleh: { // ID user admin yang membuat usulan
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    diverifikasi_oleh: { // ID user verifikator yang menyetujui/menolak
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tanggal_verifikasi: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'usulan_kp_kgb',
    timestamps: true
});

module.exports = UsulanKpKgb;