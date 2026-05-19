const AppError = require('./app.error');

class NotFoundError extends AppError {
    constructor(message, options = {}) {
        super(message, {
            ...options,
            statusCode: 404,
        });
    }
}

module.exports = NotFoundError;