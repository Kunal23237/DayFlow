const Payroll = require('../models/Payroll.model');
const Employee = require('../models/Employee.model');
const Attendance = require('../models/Attendance.model');
const ApiResponse = require('../utils/responseHandler');
const logger = require('../utils/logger');
const { asyncHandler } = require('../middleware/error.middleware');
const dayjs = require('dayjs');

/**
 * @desc    Get my payroll
 * @route   GET /api/payroll/my-payroll
 * @access  Private
 */
const getMyPayroll = asyncHandler(async (req, res) => {
    const { year, month, page = 1, limit = 12 } = req.query;

    const employee = await Employee.findOne({ user: req.user._id });

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee profile not found');
    }

    const query = { employee: employee._id };

    if (year) {
        query.year = parseInt(year);
    }

    if (month) {
        query.month = parseInt(month);
    }

    const payrolls = await Payroll.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ year: -1, month: -1 });

    const total = await Payroll.countDocuments(query);

    return ApiResponse.paginated(
        res,
        { payrolls },
        { page: parseInt(page), limit: parseInt(limit), total }
    );
});

/**
 * @desc    Get all payrolls (Admin)
 * @route   GET /api/payroll/all
 * @access  Private (Admin/HR)
 */
const getAllPayrolls = asyncHandler(async (req, res) => {
    const { year, month, department, paymentStatus, page = 1, limit = 10 } = req.query;

    const query = {};

    if (year) {
        query.year = parseInt(year);
    }

    if (month) {
        query.month = parseInt(month);
    }

    if (paymentStatus) {
        query.paymentStatus = paymentStatus;
    }

    const payrolls = await Payroll.find(query)
        .populate({
            path: 'employee',
            select: 'firstName lastName department designation profilePicture',
            match: department ? { department } : {},
        })
        .populate('user', 'employeeId email')
        .populate('generatedBy', 'employeeId email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ year: -1, month: -1 });

    // Filter out null employees (from department filter)
    const filteredPayrolls = payrolls.filter((p) => p.employee);

    const total = await Payroll.countDocuments(query);

    return ApiResponse.paginated(
        res,
        { payrolls: filteredPayrolls },
        { page: parseInt(page), limit: parseInt(limit), total }
    );
});

/**
 * @desc    Get payroll by ID (Admin)
 * @route   GET /api/payroll/:id
 * @access  Private (Admin/HR)
 */
const getPayrollById = asyncHandler(async (req, res) => {
    const payroll = await Payroll.findById(req.params.id)
        .populate('employee', 'firstName lastName department designation')
        .populate('user', 'employeeId email')
        .populate('generatedBy', 'employeeId email');

    if (!payroll) {
        return ApiResponse.notFound(res, 'Payroll record not found');
    }

    return ApiResponse.success(res, { payroll });
});

/**
 * @desc    Create/Update payroll (Admin)
 * @route   POST /api/payroll
 * @access  Private (Admin/HR)
 */
const createOrUpdatePayroll = asyncHandler(async (req, res) => {
    const {
        employeeId,
        month,
        year,
        basicSalary,
        hra,
        transportAllowance,
        medicalAllowance,
        specialAllowance,
        otherAllowances,
        providentFund,
        professionalTax,
        incomeTax,
        otherDeductions,
        paymentStatus,
        paymentMethod,
        transactionId,
        remarks,
    } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
        return ApiResponse.notFound(res, 'Employee not found');
    }

    // Calculate working days for the month
    const startDate = dayjs().year(year).month(month - 1).startOf('month').toDate();
    const endDate = dayjs().year(year).month(month - 1).endOf('month').toDate();

    const attendance = await Attendance.find({
        employee: employee._id,
        date: { $gte: startDate, $lte: endDate },
    });

    const daysWorked = attendance.filter((a) =>
        a.status === 'Present' || a.status === 'Half-day'
    ).length;

    const totalWorkingDays = dayjs().year(year).month(month - 1).daysInMonth();

    // Check if payroll already exists
    let payroll = await Payroll.findOne({
        employee: employee._id,
        month,
        year,
    });

    if (payroll) {
        // Update existing payroll
        Object.assign(payroll, {
            basicSalary,
            hra: hra || 0,
            transportAllowance: transportAllowance || 0,
            medicalAllowance: medicalAllowance || 0,
            specialAllowance: specialAllowance || 0,
            otherAllowances: otherAllowances || 0,
            providentFund: providentFund || 0,
            professionalTax: professionalTax || 0,
            incomeTax: incomeTax || 0,
            otherDeductions: otherDeductions || 0,
            daysWorked,
            totalWorkingDays,
            paymentStatus: paymentStatus || payroll.paymentStatus,
            paymentMethod,
            transactionId,
            remarks,
            generatedBy: req.user._id,
        });
    } else {
        // Create new payroll
        payroll = new Payroll({
            employee: employee._id,
            user: employee.user,
            month,
            year,
            basicSalary,
            hra: hra || 0,
            transportAllowance: transportAllowance || 0,
            medicalAllowance: medicalAllowance || 0,
            specialAllowance: specialAllowance || 0,
            otherAllowances: otherAllowances || 0,
            providentFund: providentFund || 0,
            professionalTax: professionalTax || 0,
            incomeTax: incomeTax || 0,
            otherDeductions: otherDeductions || 0,
            daysWorked,
            totalWorkingDays,
            paymentStatus: paymentStatus || 'Pending',
            paymentMethod,
            transactionId,
            remarks,
            generatedBy: req.user._id,
        });
    }

    await payroll.save();

    logger.info(`Payroll ${payroll.isNew ? 'created' : 'updated'} for employee: ${employee._id} - ${month}/${year}`);

    return ApiResponse.success(
        res,
        { payroll },
        `Payroll ${payroll.isNew ? 'created' : 'updated'} successfully`,
        payroll.isNew ? 201 : 200
    );
});

/**
 * @desc    Generate monthly payroll for all employees (Admin)
 * @route   POST /api/payroll/generate
 * @access  Private (Admin)
 */
const generateMonthlyPayroll = asyncHandler(async (req, res) => {
    const { month, year } = req.body;

    if (!month || !year) {
        return ApiResponse.error(res, 'Month and year are required', 400);
    }

    // Get all active employees
    const employees = await Employee.find({ status: 'Active' });

    const startDate = dayjs().year(year).month(month - 1).startOf('month').toDate();
    const endDate = dayjs().year(year).month(month - 1).endOf('month').toDate();
    const totalWorkingDays = dayjs().year(year).month(month - 1).daysInMonth();

    const generatedPayrolls = [];
    const errors = [];

    for (const employee of employees) {
        try {
            // Check if payroll already exists
            const existingPayroll = await Payroll.findOne({
                employee: employee._id,
                month,
                year,
            });

            if (existingPayroll) {
                errors.push({
                    employee: employee.fullName,
                    error: 'Payroll already exists',
                });
                continue;
            }

            // Get attendance for the month
            const attendance = await Attendance.find({
                employee: employee._id,
                date: { $gte: startDate, $lte: endDate },
            });

            const daysWorked = attendance.filter((a) =>
                a.status === 'Present' || a.status === 'Half-day'
            ).length;

            // Create payroll with default values (should be customized per employee)
            const payroll = await Payroll.create({
                employee: employee._id,
                user: employee.user,
                month,
                year,
                basicSalary: 30000, // Default - should be from employee record
                hra: 10000,
                transportAllowance: 2000,
                medicalAllowance: 1500,
                providentFund: 3600,
                professionalTax: 200,
                daysWorked,
                totalWorkingDays,
                paymentStatus: 'Pending',
                generatedBy: req.user._id,
            });

            generatedPayrolls.push(payroll);
        } catch (error) {
            errors.push({
                employee: employee.fullName,
                error: error.message,
            });
        }
    }

    logger.info(`Monthly payroll generated for ${month}/${year} - ${generatedPayrolls.length} records`);

    return ApiResponse.success(
        res,
        {
            generated: generatedPayrolls.length,
            errors: errors.length,
            payrolls: generatedPayrolls,
            errorDetails: errors,
        },
        `Payroll generated for ${generatedPayrolls.length} employees`
    );
});

/**
 * @desc    Update payment status (Admin)
 * @route   PUT /api/payroll/:id/payment-status
 * @access  Private (Admin/HR)
 */
const updatePaymentStatus = asyncHandler(async (req, res) => {
    const { paymentStatus, paymentDate, paymentMethod, transactionId } = req.body;

    const payroll = await Payroll.findById(req.params.id);

    if (!payroll) {
        return ApiResponse.notFound(res, 'Payroll record not found');
    }

    if (paymentStatus) payroll.paymentStatus = paymentStatus;
    if (paymentDate) payroll.paymentDate = new Date(paymentDate);
    if (paymentMethod) payroll.paymentMethod = paymentMethod;
    if (transactionId) payroll.transactionId = transactionId;

    await payroll.save();

    logger.info(`Payment status updated for payroll: ${payroll._id}`);

    return ApiResponse.success(res, { payroll }, 'Payment status updated successfully');
});

/**
 * @desc    Get payroll statistics (Admin)
 * @route   GET /api/payroll/stats
 * @access  Private (Admin/HR)
 */
const getPayrollStats = asyncHandler(async (req, res) => {
    const { year, month } = req.query;

    const query = {};

    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);

    const stats = await Payroll.aggregate([
        { $match: query },
        {
            $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                totalGross: { $sum: '$grossSalary' },
                totalNet: { $sum: '$netSalary' },
                totalDeductions: { $sum: '$totalDeductions' },
            },
        },
    ]);

    // Get department-wise stats
    const departmentStats = await Payroll.aggregate([
        { $match: query },
        {
            $lookup: {
                from: 'employees',
                localField: 'employee',
                foreignField: '_id',
                as: 'employeeData',
            },
        },
        { $unwind: '$employeeData' },
        {
            $group: {
                _id: '$employeeData.department',
                count: { $sum: 1 },
                totalNet: { $sum: '$netSalary' },
                averageSalary: { $avg: '$netSalary' },
            },
        },
    ]);

    return ApiResponse.success(res, {
        stats,
        departmentStats,
    });
});

module.exports = {
    getMyPayroll,
    getAllPayrolls,
    getPayrollById,
    createOrUpdatePayroll,
    generateMonthlyPayroll,
    updatePaymentStatus,
    getPayrollStats,
};
