function createRunningLoggerTask(logger, options = {}) {
    return function runningLoggerTask() {
        logger.info('running', {
            requestId: options.requestId,
        });
    };
}

module.exports = {
    createRunningLoggerTask,
};