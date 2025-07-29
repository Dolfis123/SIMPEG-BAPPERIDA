// controllers/userController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Fungsi untuk mendaftarkan user baru (oleh Super Admin)
exports.registerUser = async(req, res) => {
    try {
        const { username, password, role, pegawai_id } = req.body;
        const newUser = await User.create({ username, password, role, pegawai_id });
        res.status(201).json({
            message: 'User berhasil diregistrasi',
            data: { id: newUser.id, username: newUser.username, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi untuk login
exports.loginUser = async(req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Cari user berdasarkan username (NIP)
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Username tidak ditemukan.' });
        }

        // 2. Bandingkan password yang diinput dengan hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah.' });
        }

        // 3. Jika cocok, buat JSON Web Token (JWT)
        const payload = {
            id: user.id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '8h' // Token akan kadaluarsa dalam 8 jam
        });

        res.status(200).json({
            message: 'Login berhasil',
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};