const Leave = require('../models/Leave.model');
const Employee = require('../models/Employee.model');
const User = require('../models/User.model');
const ApiResponse = require('../utils/responseHandler');
const logger = require('../utils/logger');
const { asyncHandler } = require('../middleware/error.middleware');
const { sendLeaveNotification } = require('../utils/emailService');
const dayjs = require('dayjs');

/**
 * @desc    Apply for leave
 * @route   POST /api/leaves/apply
 * @access  Private
 */
const applyLeave = asyncHandler(async (req, res) => {
    const { leaveType, startDate, endDate, reason, isHalfDay, halfDaySession } = req.body;

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    // Check leave balance
    const leaveBalance = employee.leaveBalance;
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const numberOfDays = isHalfDay ? 0.5 : end.diff(start, 'day') + 1;

    // Validate leave balance for paid/sick/casual leaves
    if (leaveType === 'Paid' && leaveBalance.paid < numberOfDays) {
        return ApiResponse.error(res, `Insufficient paid leave balance. Available: ${leaveBalance.paid} days`, 400);
    }
    if (leaveType === 'Sick' && leaveBalance.sick < numberOfDays) {
        return ApiResponse.error(res, `Insufficient sick leave balance. Available: ${leaveBalance.sick} days`, 400);
    }
    if (leaveType === 'Casual' && leaveBalance.casual < numberOfDays) {
        return ApiResponse.error(res, `Insufficient casual leave balance. Available: ${leaveBalance.casual} days`, 400);
    }

    // Create leave request
    const leave = await Leave.create({
        employee: employee._id,
        user: req.user._id,
        leaveType,
        startDate: start.toDate(),
        endDate: end.toDate(),
        reason,
        isHalfDay: isHalfDay || false,
        halfDaySession,
    });

    // Notify HR/Admin
    const admins = await User.find({ role: { $in: ['Admin', 'HR'] }, isActive: true });
    const dateRange = `${start.format('DD MMM YYYY')} to ${end.format('DD MMM YYYY')}`;

    for (const admin of admins) {
        await sendLeaveNotification(admin.email, employee.fullName, leaveType, dateRange);
    }

    logger.info(`Leave application submitted: ${req.user.employeeId} - ${leaveType}`);

    return ApiResponse.success(res, { leave }, 'Leave application submitted successfully', 201);
});

/**
 * @desc    Get my leaves
 * @route   GET /api/leaves/my-leaves
 * @access  Private
 */
const getMyLeaves = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    const query = { employee: employee._id };

    if (status) {
        query.status = status;
    }

    const leaves = await Leave.find(query)
        .populate('reviewedBy', 'employeeId email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Leave.countDocuments(query);

    return ApiResponse.paginated(
        res,
        { leaves, leaveBalance: employee.leaveBalance },
        { page: parseInt(page), limit: parseInt(limit), total }
    );
});

/**
 * @desc    Get all leaves (Admin)
 * @route   GET /api/leaves/all
 * @access  Private (Admin/HR)
 */
const getAllLeaves = asyncHandler(async (req, res) => {
    const { status, leaveType, department, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) {
        query.status = status;
    }

    if (leaveType) {
        query.leaveType = leaveType;
    }

    const leaves = await Leave.find(query)
        .populate({
            path: 'employee',
            select: 'firstName lastName department designation profilePicture',
            match: department ? { department } : {},
        })
        .populate('user', 'employeeId email')
        .populate('reviewedBy', 'employeeId email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    // Filter out null employees (from department filter)
    const filteredLeaves = leaves.filter((l) => l.employee);

    const total = await Leave.countDocuments(query);

    return ApiResponse.paginated(
        res,
        { leaves: filteredLeaves },
        { page: parseInt(page), limit: parseInt(limit), total }
    );
});

/**
 * @desc    Approve leave
 * @route   PUT /api/leaves/:id/approve
 * @access  Private (Admin/HR)
 */
const approveLeave = asyncHandler(async (req, res) => {
    const { adminComments } = req.body;

    const leave = await Leave.findById(req.params.id).populate('employee');

    if (!leave) {
        return ApiResponse.notFound(res, 'Leave request not found');
    }

    if (leave.status !== 'Pending') {
        return ApiResponse.error(res, 'Leave request has already been processed', 400);
    }

    // Update leave status
    leave.status = 'Approved';
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    leave.adminComments = adminComments;

    await leave.save();

    // Deduct from leave balance
    const employee = leave.employee;

    if (leave.leaveType === 'Paid') {
        employee.leaveBalance.paid -= leave.numberOfDays;
    } else if (leave.leaveType === 'Sick') {
        employee.leaveBalance.sick -= leave.numberOfDays;
    } else if (leave.leaveType === 'Casual') {
        employee.leaveBalance.casual -= leave.numberOfDays;
    }

    await employee.save();

    logger.info(`Leave approved: ${leave._id} by ${req.user.employeeId}`);

    return ApiResponse.success(res, { leave }, 'Leave approved successfully');
});

/**
 * @desc    Reject leave
 * @route   PUT /api/leaves/:id/reject
 * @access  Private (Admin/HR)
 */
const rejectLeave = asyncHandler(async (req, res) => {
    const { adminComments } = req.body;

    const leave = await Leave.findById(req.params.id).populate('employee');

    if (!leave) {
        return ApiResponse.notFound(res, 'Leave request not found');
    }

    if (leave.status !== 'Pending') {
        return ApiResponse.error(res, 'Leave request has already been processed', 400);
    }

    // Update leave status
    leave.status = 'Rejected';
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    leave.adminComments = adminComments || 'Leave request rejected';

    await leave.save();

    logger.info(`Leave rejected: ${leave._id} by ${req.user.employeeId}`);

    return ApiResponse.success(res, { leave }, 'Leave rejected');
});

/**
 * @desc    Cancel leave
 * @route   PUT /api/leaves/:id/cancel
 * @access  Private
 */
const cancelLeave = asyncHandler(async (req, res) => {
    const leave = await Leave.findById(req.params.id).populate('employee');

    if (!leave) {
        return ApiResponse.notFound(res, 'Leave request not found');
    }

    // Check if user owns this leave
    if (leave.user.toString() !== req.user._id.toString()) {
        return ApiResponse.forbidden(res, 'You can only cancel your own leave requests');
    }

    if (leave.status === 'Cancelled') {
        return ApiResponse.error(res, 'Leave request is already cancelled', 400);
    }

    // If leave was approved, restore leave balance
    if (leave.status === 'Approved') {
        const employee = leave.employee;

        if (leave.leaveType === 'Paid') {
            employee.leaveBalance.paid += leave.numberOfDays;
        } else if (leave.leaveType === 'Sick') {
            employee.leaveBalance.sick += leave.numberOfDays;
        } else if (leave.leaveType === 'Casual') {
            employee.leaveBalance.casual += leave.numberOfDays;
        }

        await employee.save();
    }

    leave.status = 'Cancelled';
    await leave.save();

    logger.info(`Leave cancelled: ${leave._id} by ${req.user.employeeId}`);

    return ApiResponse.success(res, { leave }, 'Leave cancelled successfully');
});

/**
 * @desc    Get leave balance
 * @route   GET /api/leaves/balance
 * @access  Private
 */
const getLeaveBalance = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    // Get leave statistics for current year
    const year = new Date().getFullYear();
    const leaveStats = await Leave.getLeaveStats(employee._id, year);

    return ApiResponse.success(res, {
        leaveBalance: employee.leaveBalance,
        usedLeaves: leaveStats,
        year,
    });
});

/**
 * @desc    Get leave statistics (Admin)
 * @route   GET /api/leaves/stats
 * @access  Private (Admin/HR)
 */
const getLeaveStats = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const start = startDate ? dayjs(startDate).toDate() : dayjs().startOf('year').toDate();
    const end = endDate ? dayjs(endDate).toDate() : dayjs().endOf('year').toDate();

    const stats = await Leave.aggregate([
        {
            $match: {
                startDate: { $gte: start, $lte: end },
            },
        },
        {
            $group: {
                _id: {
                    status: '$status',
                    leaveType: '$leaveType',
                },
                count: { $sum: 1 },
                totalDays: { $sum: '$numberOfDays' },
            },
        },
    ]);

    // Get pending leaves count
    const pendingCount = await Leave.countDocuments({ status: 'Pending' });

    return ApiResponse.success(res, {
        stats,
        pendingCount,
        dateRange: { start, end },
    });
});

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getLeaveBalance,
    getLeaveStats,
};
