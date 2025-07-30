// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rute untuk registrasi user baru 
router.post('/users/register', userController.registerUser);

// Rute untuk update user baru 
router.put('/users/:id', userController.updateUser);

// Rute untuk login
router.post('/users/login', userController.loginUser);
// Rute untuk mendapatkan daftar semua user
router.get('/users', userController.getAllUsers);
// Rute untuk mendapatkan detail user berdasarkan ID
router.get('/users/:id', userController.getUserById);
// Rute untuk menghapus user berdasarkan ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;