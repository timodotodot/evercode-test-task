const config = require('./config');
const log = require('./logger');

log('scheduler.js started');

function scheduleTask(name, interval, task) {
    setInterval(task, interval);
    log(`Task "${name}" started`);
}

scheduleTask('running-logger', config.scheduler.runningInterval, () => {
    log('running');
});