const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getLeaveBalance,
    getLeaveStats,
} = require('../controllers/leave.controller');
const { protect, isHR } = require('../middleware/auth.middleware');
const {
    validateLeaveApplication,
    validateObjectId,
    validatePagination,
} = require('../middleware/validation.middleware');

// Employee routes
router.post('/apply', protect, validateLeaveApplication, applyLeave);
router.get('/my-leaves', protect, validatePagination, getMyLeaves);
router.get('/balance', protect, getLeaveBalance);
router.put('/:id/cancel', protect, validateObjectId('id'), cancelLeave);

// Admin/HR routes
router.get('/all', protect, isHR, validatePagination, getAllLeaves);
router.get('/stats', protect, isHR, getLeaveStats);
router.put('/:id/approve', protect, isHR, validateObjectId('id'), approveLeave);
router.put('/:id/reject', protect, isHR, validateObjectId('id'), rejectLeave);

module.exports = router;
