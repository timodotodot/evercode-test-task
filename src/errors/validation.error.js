const AppError = require('./app.error');

class ValidationError extends AppError {
    constructor(message, options = {}) {
        super(message, {
            ...options,
            statusCode: 400,
        });
    }
}

module.exports = ValidationError;