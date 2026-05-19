class AppError extends Error {
    constructor(message, options = {}) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = options.statusCode || 500;
        this.timestamp = new Date().toISOString();
        this.requestId = options.requestId;
        this.context = options.context || {};

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;