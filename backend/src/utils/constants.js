/**
 * Application Constants
 * Prevents "Magic Strings" and ensures consistency across the app.
 */

// User Roles
const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

// Order Statuses
const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing', // Often treated as "completed" or "paid" in simple flows
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// HTTP Status Codes (Readable aliases)
const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Validation Messages
const MESSAGES = {
    REQUIRED_FIELD: 'Este campo es obligatorio.',
    INVALID_EMAIL: 'El formato del email no es válido.',
    NUMERIC: 'Debe ser un valor numérico.',
    POSITIVE: 'Debe ser un número positivo.',
    NOT_FOUND: 'Recurso no encontrado.',
    SERVER_ERROR: 'Error interno del servidor.'
};

module.exports = {
    ROLES,
    ORDER_STATUS,
    HTTP_CODES,
    MESSAGES
};
