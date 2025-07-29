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

module.exports = router;