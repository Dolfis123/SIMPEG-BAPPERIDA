// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Menyimpan file ke folder public/documents
        cb(null, 'public/documents');
    },
    filename: function(req, file, cb) {
        // Membuat nama file yang unik untuk menghindari duplikasi
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;