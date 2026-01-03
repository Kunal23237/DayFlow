const { body, param, query, validationResult } = require('express-validator');
const ApiResponse = require('../utils/responseHandler');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
    }
    next();
};

/**
 * Sign up validation
 */
const validateSignUp = [
    body('employeeId')
        .trim()
        .notEmpty()
        .withMessage('Employee ID is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Employee ID must be between 3 and 20 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
        .optional()
        .isIn(['Employee', 'HR', 'Admin'])
        .withMessage('Invalid role'),
    handleValidationErrors,
];

/**
 * Sign in validation
 */
const validateSignIn = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors,
];

/**
 * Employee profile validation
 */
const validateEmployeeProfile = [
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('department')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Department cannot be empty'),
    body('designation')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Designation cannot be empty'),
    handleValidationErrors,
];

/**
 * Leave application validation
 */
const validateLeaveApplication = [
    body('leaveType')
        .notEmpty()
        .withMessage('Leave type is required')
        .isIn(['Paid', 'Sick', 'Casual', 'Unpaid', 'Maternity', 'Paternity'])
        .withMessage('Invalid leave type'),
    body('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Invalid start date format'),
    body('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('Invalid end date format')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('Reason is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Reason must be between 10 and 500 characters'),
    body('isHalfDay')
        .optional()
        .isBoolean()
        .withMessage('isHalfDay must be a boolean'),
    handleValidationErrors,
];

/**
 * Attendance validation
 */
const validateAttendance = [
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    body('status')
        .optional()
        .isIn(['Present', 'Absent', 'Half-day', 'Leave', 'Holiday', 'Weekend'])
        .withMessage('Invalid attendance status'),
    handleValidationErrors,
];

/**
 * Payroll validation
 */
const validatePayroll = [
    body('month')
        .notEmpty()
        .withMessage('Month is required')
        .isInt({ min: 1, max: 12 })
        .withMessage('Month must be between 1 and 12'),
    body('year')
        .notEmpty()
        .withMessage('Year is required')
        .isInt({ min: 2000, max: 2100 })
        .withMessage('Invalid year'),
    body('basicSalary')
        .notEmpty()
        .withMessage('Basic salary is required')
        .isFloat({ min: 0 })
        .withMessage('Basic salary must be a positive number'),
    handleValidationErrors,
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (paramName = 'id') => [
    param(paramName)
        .matches(/^[0-9a-fA-F]{24}$/)
        .withMessage('Invalid ID format'),
    handleValidationErrors,
];

/**
 * Pagination validation
 */
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors,
];

module.exports = {
    validateSignUp,
    validateSignIn,
    validateEmployeeProfile,
    validateLeaveApplication,
    validateAttendance,
    validatePayroll,
    validateObjectId,
    validatePagination,
    handleValidationErrors,
};
