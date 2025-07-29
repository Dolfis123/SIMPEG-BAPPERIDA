// backend/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.stack); // Mencetak stack trace error ke console server (penting untuk debugging)

  // Mengatur status HTTP response error
  // Menggunakan status code yang ada di objek error (jika diset), jika tidak ada default ke 500 (Internal Server Error)
  res.status(err.statusCode || 500).json({
    message: err.message || 'Terjadi kesalahan pada server.', // Pesan error yang dikembalikan ke client
    errors: err.errors // Menyertakan detail error tambahan (misal: error validasi Sequelize)
  });
};