const levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4,
};

function createLogger(options = {}) {
    const appName = options.appName || 'app';
    const currentLevel = levels[options.level] ?? levels.INFO;

    function write(level, message, meta) {
        if (levels[level] > currentLevel) {
            return;
        }

        const details = [];

        if (meta?.requestId) {
            details.push(`requestId=${meta.requestId}`);
        }

        if (meta?.context && Object.keys(meta.context).length > 0) {
            details.push(`context=${JSON.stringify(meta.context)}`);
        }

        if (meta?.error) {
            details.push(`error=${meta.error.name || 'Error'}: ${meta.error.message}`);
        }

        const suffix = details.length > 0 ? ` [${details.join(' ')}]` : '';
        const line = `[${new Date().toISOString()}] [${level}] [${appName}] ${message}${suffix}`;

        switch (level) {
            case 'ERROR':
                console.error(line);
                break;
            case 'WARN':
                console.warn(line);
                break;
            default:
                console.log(line);
        }
    }

    return {
        error: (message, meta) => write('ERROR', message, meta),
        warn: (message, meta) => write('WARN', message, meta),
        info: (message, meta) => write('INFO', message, meta),
        debug: (message, meta) => write('DEBUG', message, meta),
        trace: (message, meta) => write('TRACE', message, meta),
    };
}

module.exports = {
    createLogger,
};