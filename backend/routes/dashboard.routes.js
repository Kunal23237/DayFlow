const express = require('express');
const router = express.Router();
const {
    getEmployeeDashboard,
    getAdminDashboard,
    getRecentActivity,
} = require('../controllers/dashboard.controller');
const { protect, isHR } = require('../middleware/auth.middleware');

// Employee dashboard
router.get('/employee', protect, getEmployeeDashboard);

// Admin/HR dashboard
router.get('/admin', protect, isHR, getAdminDashboard);

// Recent activity
router.get('/activity', protect, getRecentActivity);

module.exports = router;
