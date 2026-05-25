const config = require('./config/app.config');
const { createLogger } = require('./logger/logger.service');
const { createServerApp } = require('./server/server.app');
const SchedulerService = require('./scheduler/scheduler.service');
const { createRunningLoggerTask } = require('./scheduler/tasks/runningLogger.task');
const { createRequestId } = require('./utils/request-id.util');

function startApp() {
    const requestId = createRequestId();
    const logger = createLogger({
        appName: config.appName,
        level: config.logLevel,
    });

    try {
        logger.info('Application started', { requestId });

        const serverApp = createServerApp();
        serverApp.listen(config.server.port, () => {
            logger.info(`Server started on port ${config.server.port}`, { requestId });
        });

        const scheduler = new SchedulerService(logger);
        const runningLoggerTask = createRunningLoggerTask(logger, { requestId });

        scheduler.scheduleTask(
            'running-logger',
            config.scheduler.runningInterval,
            runningLoggerTask,
            { requestId },
        );
    } catch (error) {
        logger.error('Application failed to start', {
            requestId,
            error,
            context: error.context,
        });

        process.exit(1);
    }
}

if (require.main === module) {
    startApp();
}

module.exports = {
    startApp,
};