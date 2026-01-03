const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiResponse = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * Protect routes - Verify JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return ApiResponse.unauthorized(res, 'Not authorized to access this route');
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return ApiResponse.unauthorized(res, 'User not found');
            }

            if (!req.user.isActive) {
                return ApiResponse.forbidden(res, 'Your account has been deactivated');
            }

            next();
        } catch (error) {
            logger.error(`Token verification error: ${error.message}`);
            return ApiResponse.unauthorized(res, 'Invalid or expired token');
        }
    } catch (error) {
        logger.error(`Auth middleware error: ${error.message}`);
        return ApiResponse.error(res, 'Authentication failed', 500);
    }
};

/**
 * Check if user is Admin
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        return ApiResponse.forbidden(res, 'Access denied. Admin privileges required.');
    }
};

/**
 * Check if user is HR or Admin
 */
const isHR = (req, res, next) => {
    if (req.user && (req.user.role === 'HR' || req.user.role === 'Admin')) {
        next();
    } else {
        return ApiResponse.forbidden(res, 'Access denied. HR privileges required.');
    }
};


/**
 * Check if user is Employee (any role)
 */
const isEmployee = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return ApiResponse.unauthorized(res, 'Employee authentication required');
    }
};

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    });
};

module.exports = {
    protect,
    isAdmin,
    isHR,
    isEmployee,
    generateToken,
    generateRefreshToken,
};
