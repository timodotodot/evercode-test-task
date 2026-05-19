const AppError = require('./app.error');

class SchedulerError extends AppError {
    constructor(message, options = {}) {
        super(message, {
            ...options,
            statusCode: 500,
        });
    }
}

module.exports = SchedulerError;