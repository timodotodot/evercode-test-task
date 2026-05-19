const SchedulerService = require('../src/scheduler/scheduler.service');
const { ValidationError } = require('../src/errors');

describe('SchedulerService', () => {
    let logger;

    beforeEach(() => {
        jest.useFakeTimers();
        logger = {
            error: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
            trace: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test('starts task and logs requestId', () => {
        const scheduler = new SchedulerService(logger);
        const task = jest.fn();

        const timerId = scheduler.scheduleTask('example-task', 1000, task, {
            requestId: 'request-1',
        });

        jest.advanceTimersByTime(1000);

        expect(timerId).toBeDefined();
        expect(task).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith('Task "example-task" started', {
            requestId: 'request-1',
        });
    });

    test('throws ValidationError when interval is invalid', () => {
        const scheduler = new SchedulerService(logger);

        expect(() => {
            scheduler.scheduleTask('example-task', 0, jest.fn(), {
                requestId: 'request-1',
            });
        }).toThrow(ValidationError);
    });
});