// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard/stats', dashboardController.getDashboardStats);
// --- RUTE BARU UNTUK ANALITIK ---
router.get('/dashboard/analytics', dashboardController.getFullAnalytics);

module.exports = router;