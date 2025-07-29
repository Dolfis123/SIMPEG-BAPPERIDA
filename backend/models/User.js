// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: { // Akan diisi dengan NIP
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin_kepegawaian', 'verifikator', 'super_admin'),
        allowNull: false,
    },
    pegawai_id: { // Terhubung ke tabel pegawai
        type: DataTypes.INTEGER,
        allowNull: true, // Mungkin NULL untuk Super Admin
    },
    status_akun: {
        type: DataTypes.ENUM('aktif', 'nonaktif'),
        defaultValue: 'aktif',
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        // Hook ini berjalan secara otomatis SEBELUM user baru dibuat
        beforeCreate: async(user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hook ini berjalan SEBELUM user di-update
        beforeUpdate: async(user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

module.exports = User;