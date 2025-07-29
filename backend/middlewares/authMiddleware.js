// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // 1. Ambil token dari header 'Authorization'
    const authHeader = req.headers['authorization'];
    // Token dikirim dengan format "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Jika tidak ada token, tolak akses
    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
    }

    try {
        // 3. Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Simpan informasi user (dari token) ke dalam object request
        // agar bisa digunakan oleh controller selanjutnya
        req.user = decoded; // Ini akan berisi { id: ..., role: ... }

        // 5. Lanjutkan ke proses berikutnya (controller)
        next();
    } catch (error) {
        // Jika token tidak valid atau kadaluarsa
        res.status(403).json({ message: 'Token tidak valid.' });
    }
};

module.exports = authMiddleware;