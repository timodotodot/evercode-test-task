const { SchedulerError, ValidationError } = require('../errors');

class SchedulerService {
    constructor(logger) {
        this.logger = logger;
        this.timers = new Map();
    }

    scheduleTask(name, interval, task, options = {}) {
        this.validateTask(name, interval, task, options.requestId);

        const timerId = setInterval(async () => {
            try {
                await task();
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

        this.timers.set(name, timerId);

        this.logger.info(`Task "${name}" started`, {
            requestId: options.requestId,
        });

        return timerId;
    }

    stopAll() {
        for (const timerId of this.timers.values()) {
            clearInterval(timerId);
        }

        this.timers.clear();

        this.logger.info('All scheduled tasks stopped');
    }

    validateTask(name, interval, task, requestId) {
        if (typeof task !== 'function') {
            throw new ValidationError('Task handler must be a function', {
                requestId,
                context: { taskType: typeof task },
            });
        }
    }
}

module.exports = SchedulerService;