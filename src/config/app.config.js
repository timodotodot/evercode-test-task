require('dotenv').config({ quiet: true });

const config = {
    appName: 'evercode-test-task',
    logLevel: 'INFO',
    server: {
        port: 3000,
    },
    scheduler: {
        runningInterval: 10000,
    },
    auth: {
        token: process.env.AUTH_TOKEN
    }
};

module.exports = config;