const Employee = require('../models/Employee.model');
const User = require('../models/User.model');
const ApiResponse = require('../utils/responseHandler');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Get employee profile
 * @route   GET /api/employees/profile
 * @access  Private
 */
const getMyProfile = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ user: req.user._id })
        .populate('user', '-password')
        .populate('reportingManager', 'firstName lastName designation');

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    return ApiResponse.success(res, { employee });
});

/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Private (Admin/HR)
 */
const getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id)
        .populate('user', '-password')
        .populate('reportingManager', 'firstName lastName designation');

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee not found');
    }

    return ApiResponse.success(res, { employee });
});

/**
 * @desc    Get all employees
 * @route   GET /api/employees
 * @access  Private (Admin/HR)
 */
const getAllEmployees = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, department, status, search } = req.query;

    // Build query
    const query = {};

    if (department) {
        query.department = department;
    }

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
        ];
    }

    // Execute query with pagination
    const employees = await Employee.find(query)
        .populate('user', 'employeeId email role')
        .populate('reportingManager', 'firstName lastName')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    return ApiResponse.paginated(
        res,
        { employees },
        { page: parseInt(page), limit: parseInt(limit), total },
        'Employees retrieved successfully'
    );
});

/**
 * @desc    Update employee profile
 * @route   PUT /api/employees/profile
 * @access  Private
 */
const updateMyProfile = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    // Fields that employees can update
    const allowedFields = [
        'phone',
        'alternatePhone',
        'address',
        'emergencyContact',
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            employee[field] = req.body[field];
        }
    });

    await employee.save();

    logger.info(`Employee profile updated: ${req.user.employeeId}`);

    return ApiResponse.success(res, { employee }, 'Profile updated successfully');
});

/**
 * @desc    Update employee by ID (Admin)
 * @route   PUT /api/employees/:id
 * @access  Private (Admin/HR)
 */
const updateEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee not found');
    }

    // Admin can update all fields except user reference
    const updateData = { ...req.body };
    delete updateData.user; // Don't allow changing user reference

    Object.assign(employee, updateData);
    await employee.save();

    logger.info(`Employee updated by admin: ${employee._id}`);

    return ApiResponse.success(res, { employee }, 'Employee updated successfully');
});

/**
 * @desc    Upload profile picture
 * @route   POST /api/employees/upload-picture
 * @access  Private
 */
const uploadProfilePicture = asyncHandler(async (req, res) => {
    if (!req.file) {
        return ApiResponse.error(res, 'Please upload a file', 400);
    }

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    // Delete old image from Cloudinary if exists
    if (employee.profilePicture?.publicId) {
        try {
            await cloudinary.uploader.destroy(employee.profilePicture.publicId);
        } catch (error) {
            logger.error(`Error deleting old profile picture: ${error.message}`);
        }
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'dayflow/profile-pictures',
                transformation: [
                    { width: 500, height: 500, crop: 'fill' },
                    { quality: 'auto' },
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(req.file.buffer);
    });

    // Update employee profile
    employee.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id,
    };

    await employee.save();

    logger.info(`Profile picture uploaded: ${req.user.employeeId}`);

    return ApiResponse.success(
        res,
        { profilePicture: employee.profilePicture },
        'Profile picture uploaded successfully'
    );
});

/**
 * @desc    Upload document
 * @route   POST /api/employees/upload-document
 * @access  Private
 */
const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        return ApiResponse.error(res, 'Please upload a file', 400);
    }

    const { name, type } = req.body;

    if (!name || !type) {
        return ApiResponse.error(res, 'Document name and type are required', 400);
    }

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'dayflow/documents',
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(req.file.buffer);
    });

    // Add document to employee
    employee.documents.push({
        name,
        type,
        url: result.secure_url,
        publicId: result.public_id,
    });

    await employee.save();

    logger.info(`Document uploaded: ${req.user.employeeId} - ${name}`);

    return ApiResponse.success(
        res,
        { document: employee.documents[employee.documents.length - 1] },
        'Document uploaded successfully'
    );
});

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Private (Admin)
 */
const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee not found');
    }

    // Delete associated user
    await User.findByIdAndDelete(employee.user);

    // Delete employee
    await employee.deleteOne();

    logger.info(`Employee deleted: ${req.params.id}`);

    return ApiResponse.success(res, null, 'Employee deleted successfully');
});

/**
 * @desc    Get departments list
 * @route   GET /api/employees/departments
 * @access  Private
 */
const getDepartments = asyncHandler(async (req, res) => {
    const departments = await Employee.distinct('department');

    return ApiResponse.success(res, { departments });
});

module.exports = {
    getMyProfile,
    getEmployeeById,
    getAllEmployees,
    updateMyProfile,
    updateEmployee,
    uploadProfilePicture,
    uploadDocument,
    deleteEmployee,
    getDepartments,
};
