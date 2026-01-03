const Employee = require('../models/Employee.model');
const Attendance = require('../models/Attendance.model');
const Leave = require('../models/Leave.model');
const Payroll = require('../models/Payroll.model');
const ApiResponse = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/error.middleware');
const dayjs = require('dayjs');

/**
 * @desc    Get employee dashboard data
 * @route   GET /api/dashboard/employee
 * @access  Private
 */
const getEmployeeDashboard = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ user: req.user._id })
        .populate('reportingManager', 'firstName lastName designation');

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    // Get today's attendance
    const today = dayjs().startOf('day').toDate();
    const todayAttendance = await Attendance.findOne({
        employee: employee._id,
        date: today,
    });

    // Get this month's attendance summary
    const monthStart = dayjs().startOf('month').toDate();
    const monthEnd = dayjs().endOf('month').toDate();

    const monthAttendance = await Attendance.find({
        employee: employee._id,
        date: { $gte: monthStart, $lte: monthEnd },
    });

    const attendanceStats = {
        present: monthAttendance.filter((a) => a.status === 'Present').length,
        absent: monthAttendance.filter((a) => a.status === 'Absent').length,
        halfDay: monthAttendance.filter((a) => a.status === 'Half-day').length,
        leave: monthAttendance.filter((a) => a.status === 'Leave').length,
        totalHours: monthAttendance.reduce((sum, a) => sum + (a.workingHours || 0), 0),
    };

    // Get pending leaves
    const pendingLeaves = await Leave.find({
        employee: employee._id,
        status: 'Pending',
    }).sort({ createdAt: -1 });

    // Get recent leaves
    const recentLeaves = await Leave.find({
        employee: employee._id,
    })
        .sort({ createdAt: -1 })
        .limit(5);

    // Get current month payroll
    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();

    const currentPayroll = await Payroll.findOne({
        employee: employee._id,
        month: currentMonth,
        year: currentYear,
    });

    return ApiResponse.success(res, {
        employee: {
            id: employee._id,
            fullName: employee.fullName,
            department: employee.department,
            designation: employee.designation,
            profilePicture: employee.profilePicture?.url,
            joiningDate: employee.joiningDate,
            reportingManager: employee.reportingManager,
        },
        todayAttendance: todayAttendance || null,
        attendanceStats,
        leaveBalance: employee.leaveBalance,
        pendingLeaves,
        recentLeaves,
        currentPayroll: currentPayroll
            ? {
                month: currentPayroll.month,
                year: currentPayroll.year,
                netSalary: currentPayroll.netSalary,
                paymentStatus: currentPayroll.paymentStatus,
            }
            : null,
    });
});

/**
 * @desc    Get admin dashboard data
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin/HR)
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
    // Total employees
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });

    // Department-wise employee count
    const departmentStats = await Employee.aggregate([
        { $match: { status: 'Active' } },
        {
            $group: {
                _id: '$department',
                count: { $sum: 1 },
            },
        },
    ]);

    // Today's attendance
    const today = dayjs().startOf('day').toDate();
    const todayAttendance = await Attendance.find({ date: today });

    const attendanceToday = {
        total: todayAttendance.length,
        present: todayAttendance.filter((a) => a.status === 'Present').length,
        absent: todayAttendance.filter((a) => a.status === 'Absent').length,
        halfDay: todayAttendance.filter((a) => a.status === 'Half-day').length,
        leave: todayAttendance.filter((a) => a.status === 'Leave').length,
        notMarked: totalEmployees - todayAttendance.length,
    };

    // Pending leave requests
    const pendingLeaves = await Leave.find({ status: 'Pending' })
        .populate('employee', 'firstName lastName department designation profilePicture')
        .populate('user', 'employeeId email')
        .sort({ createdAt: -1 })
        .limit(10);

    // This month's leave statistics
    const monthStart = dayjs().startOf('month').toDate();
    const monthEnd = dayjs().endOf('month').toDate();

    const monthLeaveStats = await Leave.aggregate([
        {
            $match: {
                startDate: { $gte: monthStart, $lte: monthEnd },
            },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalDays: { $sum: '$numberOfDays' },
            },
        },
    ]);

    // Current month payroll statistics
    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();

    const payrollStats = await Payroll.aggregate([
        {
            $match: {
                month: currentMonth,
                year: currentYear,
            },
        },
        {
            $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                totalAmount: { $sum: '$netSalary' },
            },
        },
    ]);

    // Recent activities (last 10)
    const recentEmployees = await Employee.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName department joiningDate');

    // Employees on leave today
    const employeesOnLeave = await Leave.find({
        status: 'Approved',
        startDate: { $lte: today },
        endDate: { $gte: today },
    })
        .populate('employee', 'firstName lastName department designation profilePicture')
        .populate('user', 'employeeId');

    return ApiResponse.success(res, {
        totalEmployees,
        departmentStats,
        attendanceToday,
        pendingLeaves: {
            count: pendingLeaves.length,
            requests: pendingLeaves,
        },
        monthLeaveStats,
        payrollStats,
        recentEmployees,
        employeesOnLeave,
    });
});

/**
 * @desc    Get recent activity
 * @route   GET /api/dashboard/activity
 * @access  Private
 */
const getRecentActivity = asyncHandler(async (req, res) => {
    const { limit = 20 } = req.query;

    const isAdmin = req.user.role === 'Admin' || req.user.role === 'HR';

    let activities = [];

    if (isAdmin) {
        // Get recent leaves
        const recentLeaves = await Leave.find()
            .populate('employee', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit / 2);

        recentLeaves.forEach((leave) => {
            activities.push({
                type: 'leave',
                action: `${leave.employee?.fullName} applied for ${leave.leaveType} leave`,
                status: leave.status,
                date: leave.createdAt,
                data: leave,
            });
        });

        // Get recent employees
        const recentEmployees = await Employee.find()
            .sort({ createdAt: -1 })
            .limit(limit / 2);

        recentEmployees.forEach((emp) => {
            activities.push({
                type: 'employee',
                action: `${emp.fullName} joined as ${emp.designation}`,
                date: emp.createdAt,
                data: emp,
            });
        });
    } else {
        // Employee's own activities
        const employee = await Employee.findOne({ user: req.user._id });

        if (employee) {
            // Get own leaves
            const myLeaves = await Leave.find({ employee: employee._id })
                .sort({ createdAt: -1 })
                .limit(limit / 2);

            myLeaves.forEach((leave) => {
                activities.push({
                    type: 'leave',
                    action: `You applied for ${leave.leaveType} leave`,
                    status: leave.status,
                    date: leave.createdAt,
                    data: leave,
                });
            });

            // Get own attendance
            const myAttendance = await Attendance.find({ employee: employee._id })
                .sort({ date: -1 })
                .limit(limit / 2);

            myAttendance.forEach((att) => {
                activities.push({
                    type: 'attendance',
                    action: `Attendance marked as ${att.status}`,
                    date: att.date,
                    data: att,
                });
            });
        }
    }

    // Sort all activities by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return ApiResponse.success(res, {
        activities: activities.slice(0, limit),
    });
});

module.exports = {
    getEmployeeDashboard,
    getAdminDashboard,
    getRecentActivity,
};
