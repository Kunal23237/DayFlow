const Attendance = require('../models/Attendance.model');
const Employee = require('../models/Employee.model');
const ApiResponse = require('../utils/responseHandler');
const logger = require('../utils/logger');
const { asyncHandler } = require('../middleware/error.middleware');
const dayjs = require('dayjs');

/**
 * @desc    Check in
 * @route   POST /api/attendance/check-in
 * @access  Private
 */
const checkIn = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    const today = dayjs().startOf('day').toDate();

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
        employee: employee._id,
        date: today,
    });

    if (existingAttendance && existingAttendance.checkIn) {
        return ApiResponse.error(res, 'You have already checked in today', 400);
    }

    // Create or update attendance
    const attendance = existingAttendance || new Attendance({
        employee: employee._id,
        user: req.user._id,
        date: today,
    });

    attendance.checkIn = new Date();
    attendance.status = 'Present';

    // Check if late (assuming 9:00 AM is the start time)
    const checkInTime = dayjs(attendance.checkIn);
    const standardTime = dayjs().hour(9).minute(0).second(0);

    if (checkInTime.isAfter(standardTime)) {
        attendance.isLate = true;
        attendance.lateBy = checkInTime.diff(standardTime, 'minute');
    }

    // Add location if provided
    if (req.body.location) {
        attendance.location = {
            checkIn: req.body.location,
        };
    }

    await attendance.save();

    logger.info(`Check-in recorded: ${req.user.employeeId} at ${attendance.checkIn}`);

    return ApiResponse.success(res, { attendance }, 'Check-in successful');
});

/**
 * @desc    Check out
 * @route   POST /api/attendance/check-out
 * @access  Private
 */
const checkOut = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    const today = dayjs().startOf('day').toDate();

    const attendance = await Attendance.findOne({
        employee: employee._id,
        date: today,
    });

    if (!attendance) {
        return ApiResponse.error(res, 'No check-in record found for today', 400);
    }

    if (!attendance.checkIn) {
        return ApiResponse.error(res, 'Please check in first', 400);
    }

    if (attendance.checkOut) {
        return ApiResponse.error(res, 'You have already checked out today', 400);
    }

    attendance.checkOut = new Date();

    // Add location if provided
    if (req.body.location) {
        attendance.location.checkOut = req.body.location;
    }

    await attendance.save();

    logger.info(`Check-out recorded: ${req.user.employeeId} at ${attendance.checkOut}`);

    return ApiResponse.success(res, { attendance }, 'Check-out successful');
});

/**
 * @desc    Get my attendance
 * @route   GET /api/attendance/my-attendance
 * @access  Private
 */
const getMyAttendance = asyncHandler(async (req, res) => {
    const { startDate, endDate, view = 'monthly' } = req.query;

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    // Calculate date range based on view
    let start, end;

    if (startDate && endDate) {
        start = dayjs(startDate).startOf('day').toDate();
        end = dayjs(endDate).endOf('day').toDate();
    } else if (view === 'weekly') {
        start = dayjs().startOf('week').toDate();
        end = dayjs().endOf('week').toDate();
    } else if (view === 'daily') {
        start = dayjs().startOf('day').toDate();
        end = dayjs().endOf('day').toDate();
    } else {
        // Monthly by default
        start = dayjs().startOf('month').toDate();
        end = dayjs().endOf('month').toDate();
    }

    const attendance = await Attendance.find({
        employee: employee._id,
        date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    // Calculate statistics
    const stats = {
        totalDays: attendance.length,
        present: attendance.filter((a) => a.status === 'Present').length,
        absent: attendance.filter((a) => a.status === 'Absent').length,
        halfDay: attendance.filter((a) => a.status === 'Half-day').length,
        leave: attendance.filter((a) => a.status === 'Leave').length,
        totalHours: attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0),
        averageHours: 0,
    };

    if (stats.present > 0) {
        stats.averageHours = (stats.totalHours / stats.present).toFixed(2);
    }

    return ApiResponse.success(res, { attendance, stats, dateRange: { start, end } });
});

/**
 * @desc    Get all attendance (Admin)
 * @route   GET /api/attendance/all
 * @access  Private (Admin/HR)
 */
const getAllAttendance = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, date, department, status } = req.query;

    // Build query
    const query = {};

    if (date) {
        const targetDate = dayjs(date).startOf('day').toDate();
        query.date = targetDate;
    }

    if (status) {
        query.status = status;
    }

    // Get attendance with employee details
    const attendance = await Attendance.find(query)
        .populate({
            path: 'employee',
            select: 'firstName lastName department designation profilePicture',
            match: department ? { department } : {},
        })
        .populate('user', 'employeeId email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ date: -1, checkIn: -1 });

    // Filter out null employees (from department filter)
    const filteredAttendance = attendance.filter((a) => a.employee);

    const total = await Attendance.countDocuments(query);

    return ApiResponse.paginated(
        res,
        { attendance: filteredAttendance },
        { page: parseInt(page), limit: parseInt(limit), total },
        'Attendance records retrieved successfully'
    );
});

/**
 * @desc    Update attendance (Admin)
 * @route   PUT /api/attendance/:id
 * @access  Private (Admin/HR)
 */
const updateAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
        return ApiResponse.notFound(res, 'Attendance record not found');
    }

    // Update fields
    const { status, checkIn, checkOut, remarks } = req.body;

    if (status) attendance.status = status;
    if (checkIn) attendance.checkIn = new Date(checkIn);
    if (checkOut) attendance.checkOut = new Date(checkOut);
    if (remarks) attendance.remarks = remarks;

    attendance.markedBy = req.user._id;
    attendance.isManualEntry = true;

    await attendance.save();

    logger.info(`Attendance updated by admin: ${req.params.id}`);

    return ApiResponse.success(res, { attendance }, 'Attendance updated successfully');
});

/**
 * @desc    Get attendance statistics
 * @route   GET /api/attendance/stats
 * @access  Private (Admin/HR)
 */
const getAttendanceStats = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const start = startDate ? dayjs(startDate).startOf('day').toDate() : dayjs().startOf('month').toDate();
    const end = endDate ? dayjs(endDate).endOf('day').toDate() : dayjs().endOf('month').toDate();

    const stats = await Attendance.aggregate([
        {
            $match: {
                date: { $gte: start, $lte: end },
            },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalHours: { $sum: '$workingHours' },
            },
        },
    ]);

    // Get department-wise stats
    const departmentStats = await Attendance.aggregate([
        {
            $match: {
                date: { $gte: start, $lte: end },
            },
        },
        {
            $lookup: {
                from: 'employees',
                localField: 'employee',
                foreignField: '_id',
                as: 'employeeData',
            },
        },
        {
            $unwind: '$employeeData',
        },
        {
            $group: {
                _id: '$employeeData.department',
                totalPresent: {
                    $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] },
                },
                totalAbsent: {
                    $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] },
                },
                averageHours: { $avg: '$workingHours' },
            },
        },
    ]);

    return ApiResponse.success(res, {
        stats,
        departmentStats,
        dateRange: { start, end },
    });
});

/**
 * @desc    Mark attendance manually (Admin)
 * @route   POST /api/attendance/mark
 * @access  Private (Admin/HR)
 */
const markAttendance = asyncHandler(async (req, res) => {
    const { employeeId, date, status, remarks } = req.body;

    if (!employeeId || !date || !status) {
        return ApiResponse.error(res, 'Employee ID, date, and status are required', 400);
    }

    let employee;
    const mongoose = require('mongoose');

    // Check if employeeId is a valid ObjectId (direct lookup)
    if (mongoose.Types.ObjectId.isValid(employeeId)) {
        employee = await Employee.findById(employeeId);
    }

    // If not found or not ObjectId, try lookup by custom employeeId string (e.g. EMP001) in User model
    if (!employee) {
        const User = require('../models/User.model');
        const user = await User.findOne({ employeeId: employeeId });
        if (user) {
            employee = await Employee.findOne({ user: user._id });
        }
    }

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee not found');
    }

    const targetDate = dayjs(date).startOf('day').toDate();

    // Check if attendance already exists
    let attendance = await Attendance.findOne({
        employee: employee._id,
        date: targetDate,
    });

    if (attendance) {
        attendance.status = status;
        attendance.remarks = remarks;
        attendance.markedBy = req.user._id;
        attendance.isManualEntry = true;
    } else {
        attendance = new Attendance({
            employee: employee._id,
            user: employee.user,
            date: targetDate,
            status,
            remarks,
            markedBy: req.user._id,
            isManualEntry: true,
        });
    }

    await attendance.save();

    logger.info(`Attendance marked by admin for employee: ${employee._id} on ${date}`);

    return ApiResponse.success(res, { attendance }, 'Attendance marked successfully');
});

module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    updateAttendance,
    getAttendanceStats,
    markAttendance,
};
