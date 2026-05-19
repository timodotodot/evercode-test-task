const { SchedulerError, ValidationError } = require('../errors');

class SchedulerService {
    constructor(logger) {
        this.logger = logger;
    }

    scheduleTask(name, interval, task, options = {}) {
        this.validateTask(name, interval, task, options.requestId);

        const timerId = setInterval(() => {
            try {
                task();
            } catch (error) {
                const schedulerError = new SchedulerError(`Task "${name}" failed`, {
                    requestId: options.requestId,
                    context: { taskName: name },
                });

                this.logger.error(schedulerError.message, {
                    requestId: options.requestId,
                    error,
                    context: schedulerError.context,
                });
            }
        }, interval);

        this.logger.info(`Task "${name}" started`, {
            requestId: options.requestId,
        });

        return timerId;
    }

    validateTask(name, interval, task, requestId) {
        if (!name || typeof name !== 'string') {
            throw new ValidationError('Task name must be a non-empty string', {
                requestId,
                context: { name },
            });
        }

        if (!Number.isFinite(interval) || interval <= 0) {
            throw new ValidationError('Task interval must be a positive number', {
                requestId,
                context: { interval },
            });
        }

        if (typeof task !== 'function') {
            throw new ValidationError('Task handler must be a function', {
                requestId,
                context: { taskType: typeof task },
            });
        }
    }
}

module.exports = SchedulerService;