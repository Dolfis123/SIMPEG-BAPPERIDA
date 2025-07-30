// controllers/userController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Anda perlu menginstal bcrypt: npm install bcrypt


/**
 * Fungsi untuk meregistrasi User baru.
 * Termasuk pengecekan untuk memastikan 'username' belum digunakan dan enkripsi password.
 */
exports.registerUser = async(req, res) => {
    try {
        const { username, password, role, pegawai_id } = req.body;

        // 1. Cek apakah username sudah terdaftar
        const existingUser = await User.findOne({ where: { username: username } });

        // 2. Jika username sudah ada, kirim respons error yang informatif
        if (existingUser) {
            return res.status(409).json({
                message: `Registrasi gagal. Username '${username}' sudah digunakan oleh pengguna lain.`
            });
        }

        // 4. Buat user baru dengan password yang sudah di-hash
        const newUser = await User.create({
            username,
            password,
            role,
            pegawai_id
        });

        // 5. Kirim respons sukses tanpa menyertakan password
        res.status(201).json({
            message: 'User berhasil diregistrasi',
            data: { id: newUser.id, username: newUser.username, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Fungsi untuk mengupdate data User berdasarkan ID.
 * Termasuk pengecekan duplikasi username dan penanganan update password.
 */
exports.updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        let { username, password, role } = req.body;

        // 1. Cari User yang akan diupdate
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        // 2. Cek duplikasi HANYA JIKA 'username' diubah
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ where: { username: username } });
            if (existingUser) {
                return res.status(409).json({
                    message: `Gagal memperbarui. Username '${username}' sudah digunakan.`
                });
            }
        }

        // 4. Lakukan update data
        await user.update({
            username: username || user.username, // Gunakan username baru atau yang lama jika tidak diubah
            role: role || user.role, // Gunakan role baru atau yang lama jika tidak diubah
            password: password || user.password // Gunakan password baru (sudah di-hash) atau yang lama
        });

        res.status(200).json({
            message: 'User berhasil diperbarui',
            data: { id: user.id, username: user.username, role: user.role }
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

// Mengambil semua data pengguna (tanpa password)
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Jangan pernah kirim password ke frontend
            order: [
                ['username', 'ASC']
            ]
        });
        res.status(200).json({ message: 'Data pengguna berhasil diambil', data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Menghapus pengguna
exports.deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        // Tambahan: Logika untuk mencegah super_admin menghapus dirinya sendiri
        if (req.user.id === parseInt(id, 10)) {
            return res.status(403).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
        }

        await user.destroy();
        res.status(200).json({ message: 'Pengguna berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengambil detail satu pengguna berdasarkan ID
exports.getUserById = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] } // Pastikan password tidak disertakan
        });

        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.status(200).json({ message: 'Detail pengguna berhasil diambil', data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};