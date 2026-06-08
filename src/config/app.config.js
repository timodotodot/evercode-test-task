require('dotenv').config({ quiet: true });
const { z } = require('zod');

const configSchema = z.object({
    appName: z.string(),
    logLevel: z.enum(['INFO', 'DEBUG', 'ERROR']),
    server: z.object({
        port: z.number().int().positive()
    }),
    scheduler: z.object({
        runningInterval: z.number().int().positive()
    }),
    auth: z.object({
        token: z.string().min(1, 'AUTH_TOKEN is required')
    }),
    database: z.object({
        filename: z.string().min(1, 'DB_FILENAME is required')
    })
});

const rawConfig = {
    appName: 'evercode-test-task',
    logLevel: 'INFO',
    server: { 
        port: 3000
    },
    scheduler: { 
        runningInterval: 10000
    },
    auth: { 
        token: process.env.AUTH_TOKEN
    },
    database: { 
        filename: process.env.DB_FILENAME
    }
};

const config = configSchema.parse(rawConfig);

module.exports = config;