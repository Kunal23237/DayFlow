const express = require('express');
const router = express.Router();
const {
    getMyPayroll,
    getAllPayrolls,
    getPayrollById,
    createOrUpdatePayroll,
    generateMonthlyPayroll,
    updatePaymentStatus,
    getPayrollStats,
} = require('../controllers/payroll.controller');
const { protect, isAdmin, isHR } = require('../middleware/auth.middleware');
const {
    validatePayroll,
    validateObjectId,
    validatePagination,
} = require('../middleware/validation.middleware');

// Employee routes
router.get('/my-payroll', protect, validatePagination, getMyPayroll);

// Admin/HR routes
router.get('/all', protect, isHR, validatePagination, getAllPayrolls);
router.get('/stats', protect, isHR, getPayrollStats);
router.get('/:id', protect, isHR, validateObjectId('id'), getPayrollById);
router.post('/', protect, isHR, validatePayroll, createOrUpdatePayroll);
router.post('/generate', protect, isAdmin, generateMonthlyPayroll);
router.put('/:id/payment-status', protect, isHR, validateObjectId('id'), updatePaymentStatus);

module.exports = router;
