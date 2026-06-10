const config = require('./config/app.config');
const { createLogger } = require('./logger/logger.service');
const { createServerApp } = require('./server/server.app');
const SchedulerService = require('./scheduler/scheduler.service');
const { createRunningLoggerTask } = require('./scheduler/tasks/runningLogger.task');
const { createRequestId } = require('./utils/request-id.util');
const { initDatabase, closeDatabase } = require('./database/database');
const { createUpdatePricesTask } = require('./scheduler/tasks/update-prices.task');

async function startApp() {
    const requestId = createRequestId();
    const logger = createLogger({
        appName: config.appName,
        level: config.logLevel,
    });

    try {
        await initDatabase();

        logger.info('Application started', { requestId });

        const serverApp = createServerApp();
        const httpServer = serverApp.listen(config.server.port, () => {
            logger.info(`Server started on port ${config.server.port}`, { requestId });
        });

        const scheduler = new SchedulerService(logger);

        const runningLoggerTask = createRunningLoggerTask(logger, { requestId });
        const updatePricesTask = createUpdatePricesTask(logger, { requestId });

        scheduler.scheduleTask(
            'running-logger',
            config.scheduler.runningInterval,
            runningLoggerTask,
            { requestId },
        );

        scheduler.scheduleTask(
            'update-prices',
            config.backgroundTasks.priceUpdateInterval,
            updatePricesTask,
            { requestId },
        );

        async function shutdown(signal) {
            logger.info(`Received ${signal}, shutting down`, { requestId });

            scheduler.stopAll();

            httpServer.close(async () => {
                await closeDatabase();

                logger.info('Application stopped', { requestId });
                process.exit(0);
            });
        }

        process.on('SIGINT', () => {
            shutdown('SIGINT');
        });

        process.on('SIGTERM', () => {
            shutdown('SIGTERM');
        });
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