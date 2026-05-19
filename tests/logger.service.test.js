const { createLogger } = require('../src/logger/logger.service');

describe('createLogger', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('writes formatted info log with requestId', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const logger = createLogger({
            appName: 'test-app',
            level: 'INFO',
        });

        logger.info('Application started', {
            requestId: 'request-1',
        });

        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy.mock.calls[0][0]).toContain('[INFO] [test-app] Application started');
        expect(logSpy.mock.calls[0][0]).toContain('requestId=request-1');
    });
});