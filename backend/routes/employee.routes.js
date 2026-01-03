const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    getEmployeeById,
    getAllEmployees,
    updateMyProfile,
    updateEmployee,
    uploadProfilePicture,
    uploadDocument,
    deleteEmployee,
    getDepartments,
} = require('../controllers/employee.controller');
const { protect, isAdmin, isHR } = require('../middleware/auth.middleware');
const { upload, handleMulterError } = require('../middleware/upload.middleware');
const {
    validateEmployeeProfile,
    validateObjectId,
    validatePagination,
} = require('../middleware/validation.middleware');

// Employee routes (own profile)
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, validateEmployeeProfile, updateMyProfile);
router.post(
    '/upload-picture',
    protect,
    upload.single('profilePicture'),
    handleMulterError,
    uploadProfilePicture
);
router.post(
    '/upload-document',
    protect,
    upload.single('document'),
    handleMulterError,
    uploadDocument
);

// Admin/HR routes
router.get('/', protect, isHR, validatePagination, getAllEmployees);
router.get('/departments', protect, getDepartments);
router.get('/:id', protect, isHR, validateObjectId('id'), getEmployeeById);
router.put('/:id', protect, isHR, validateObjectId('id'), validateEmployeeProfile, updateEmployee);
router.delete('/:id', protect, isAdmin, validateObjectId('id'), deleteEmployee);

module.exports = router;
