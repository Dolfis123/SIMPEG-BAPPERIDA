// backend/models/Pegawai.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pegawai = sequelize.define('Pegawai', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nip: {
        type: DataTypes.STRING(18),
        allowNull: false,
        unique: true,
    },
    nama_lengkap: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // --- ATRIBUT LENGKAP DITAMBAHKAN DI SINI ---
    tempat_lahir: {
        type: DataTypes.STRING
    },
    tanggal_lahir: {
        type: DataTypes.DATEONLY
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('Laki-laki', 'Perempuan')
    },
    agama: {
        type: DataTypes.STRING
    },
    status_pernikahan: {
        type: DataTypes.STRING
    },
    alamat: {
        type: DataTypes.TEXT
    },
    no_hp: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    status_kepegawaian: {
        type: DataTypes.ENUM('PNS', 'CPNS', 'PPPK', 'Honorer')
    },
    tmt_cpns: {
        type: DataTypes.DATEONLY
    },
    tmt_pns: {
        type: DataTypes.DATEONLY
    },
    tmt_jabatan_sekarang: {
        type: DataTypes.DATEONLY
    },
    // -------------------------------------------
    tmt_pangkat_terakhir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    tmt_kgb_terakhir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    id_golongan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_jabatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_unit_kerja: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status_pegawai: {
        type: DataTypes.ENUM('Aktif', 'Pensiun', 'Pindah', 'Berhenti'),
        defaultValue: 'Aktif'
    }
}, {
    tableName: 'pegawai',
    timestamps: true
});

module.exports = Pegawai;