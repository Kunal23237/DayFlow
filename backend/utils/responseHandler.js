/**
 * Standardized API response handlers
 */

class ApiResponse {
    /**
     * Success response
     */
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    /**
     * Error response
     */
    static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Validation error response
     */
    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    /**
     * Unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            success: false,
            message,
        });
    }

    /**
     * Forbidden response
     */
    static forbidden(res, message = 'Access forbidden') {
        return res.status(403).json({
            success: false,
            message,
        });
    }

    /**
     * Not found response
     */
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message,
        });
    }

    /**
     * Paginated response
     */
    static paginated(res, data, pagination, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                totalPages: Math.ceil(pagination.total / pagination.limit),
            },
        });
    }
}

module.exports = ApiResponse;
