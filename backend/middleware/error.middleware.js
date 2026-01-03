const logger = require('../utils/logger');
const ApiResponse = require('../utils/responseHandler');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error(`Error: ${err.message}`, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return ApiResponse.validationError(res, errors);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return ApiResponse.error(res, `${field} already exists`, 400);
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return ApiResponse.error(res, 'Invalid ID format', 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return ApiResponse.unauthorized(res, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Token expired');
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // In production, don't leak error details
    if (process.env.NODE_ENV === 'production') {
        return ApiResponse.error(res, message, statusCode);
    }

    // In development, send full error details
    return res.status(statusCode).json({
        success: false,
        message,
        stack: err.stack,
        error: err,
    });
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
    return ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFound,
    asyncHandler,
};
