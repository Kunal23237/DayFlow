const crypto = require('crypto');
const User = require('../models/User.model');
const Employee = require('../models/Employee.model');
const ApiResponse = require('../utils/responseHandler');
const { generateToken } = require('../middleware/auth.middleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const logger = require('../utils/logger');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signUp = asyncHandler(async (req, res) => {
    const { employeeId, email, password, role, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { employeeId }],
    });

    if (existingUser) {
        if (existingUser.email === email) {
            return ApiResponse.error(res, 'Email already registered', 400);
        }
        if (existingUser.employeeId === employeeId) {
            return ApiResponse.error(res, 'Employee ID already exists', 400);
        }
    }

    // Create user
    const user = await User.create({
        employeeId,
        email,
        password,
        role: role || 'Employee',
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    await sendVerificationEmail(email, verificationToken, firstName || employeeId);

    // Create employee profile
    if (firstName && lastName) {
        await Employee.create({
            user: user._id,
            firstName,
            lastName,
            department: 'Not Assigned',
            designation: 'Not Assigned',
        });
    }

    // Generate token
    const token = generateToken(user._id);

    logger.info(`New user registered: ${email}`);

    return ApiResponse.success(
        res,
        {
            user: {
                id: user._id,
                employeeId: user.employeeId,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
            },
            token,
        },
        'Registration successful. Please check your email to verify your account.',
        201
    );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/signin
 * @access  Public
 */
const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
        return ApiResponse.forbidden(res, 'Your account has been deactivated. Please contact HR.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    // Update last login
    await user.updateLastLogin();

    // Get employee profile
    const employee = await Employee.findOne({ user: user._id });

    // Generate token
    const token = generateToken(user._id);

    logger.info(`User logged in: ${email}`);

    return ApiResponse.success(res, {
        user: {
            id: user._id,
            employeeId: user.employeeId,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            employee: employee
                ? {
                    id: employee._id,
                    fullName: employee.fullName,
                    department: employee.department,
                    designation: employee.designation,
                    profilePicture: employee.profilePicture?.url,
                }
                : null,
        },
        token,
    }, 'Login successful');
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
        return ApiResponse.error(res, 'Invalid or expired verification token', 400);
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.info(`Email verified for user: ${user.email}`);

    return ApiResponse.success(res, null, 'Email verified successfully');
});

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        // Don't reveal if email exists or not
        return ApiResponse.success(
            res,
            null,
            'If your email is registered, you will receive a password reset link.'
        );
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Get employee name
    const employee = await Employee.findOne({ user: user._id });
    const name = employee ? employee.fullName : user.employeeId;

    // Send reset email
    await sendPasswordResetEmail(email, resetToken, name);

    logger.info(`Password reset requested for: ${email}`);

    return ApiResponse.success(
        res,
        null,
        'If your email is registered, you will receive a password reset link.'
    );
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return ApiResponse.error(res, 'Invalid or expired reset token', 400);
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);

    return ApiResponse.success(res, null, 'Password reset successful. You can now login with your new password.');
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
    const user = req.user;
    const employee = await Employee.findOne({ user: user._id });

    return ApiResponse.success(res, {
        user: {
            id: user._id,
            employeeId: user.employeeId,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            employee: employee
                ? {
                    id: employee._id,
                    fullName: employee.fullName,
                    department: employee.department,
                    designation: employee.designation,
                    profilePicture: employee.profilePicture?.url,
                }
                : null,
        },
    });
});

module.exports = {
    signUp,
    signIn,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getMe,
};
