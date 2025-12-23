const { validationResult } = require('express-validator');
const { HTTP_CODES } = require('../utils/constants');

/**
 * Validation Middleware
 * Checks if 'express-validator' found any errors in the request.
 * If errors exist, it responds instantly with 400 Bad Request.
 * Otherwise, it passes control to the next middleware/controller.
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('❌ [Validation] Failed for:', req.method, req.path);
        console.log('  Errors:', errors.array());
        console.log('  Body:', req.body);
        return res.status(HTTP_CODES.BAD_REQUEST).json({
            status: 'fail',
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

module.exports = validateRequest;
