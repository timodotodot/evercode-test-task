const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Evercode Test Task API',
            version: '1.0.0',
            description: 'API documentation for Evercode test task',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
            schemas: {
                Currency: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            example: 'Bitcoin',
                        },
                        ticker: {
                            type: 'string',
                            example: 'BTC',
                        },
                    },
                    required: ['id', 'name', 'ticker'],
                },
                CreateCurrencyRequest: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Bitcoin',
                        },
                        ticker: {
                            type: 'string',
                            example: 'BTC',
                        },
                    },
                    required: ['name', 'ticker'],
                },
                UpdateCurrencyRequest: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Ethereum',
                        },
                        ticker: {
                            type: 'string',
                            example: 'ETH',
                        },
                    },
                },
            },
        },
    },
    apis: [
        './src/server/*.js',
        './src/currency/*.js',
    ],
});

module.exports = {
    swaggerSpec,
};