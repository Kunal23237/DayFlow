const express = require('express');
const router = express.Router();
const {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    updateAttendance,
    getAttendanceStats,
    markAttendance,
} = require('../controllers/attendance.controller');
const { protect, isHR } = require('../middleware/auth.middleware');
const {
    validateAttendance,
    validateObjectId,
    validatePagination,
} = require('../middleware/validation.middleware');

// Employee routes
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/my-attendance', protect, getMyAttendance);

// Admin/HR routes
router.get('/all', protect, isHR, validatePagination, getAllAttendance);
router.get('/stats', protect, isHR, getAttendanceStats);
router.post('/mark', protect, isHR, validateAttendance, markAttendance);
router.put('/:id', protect, isHR, validateObjectId('id'), validateAttendance, updateAttendance);

module.exports = router;
