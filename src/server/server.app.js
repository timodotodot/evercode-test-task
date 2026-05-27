const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { createCurrencyRouter } = require('../currency/currency.router');
const { createPriceRouter } = require('../price/price.router');
const { authMiddleware } = require('../auth/auth.middleware');
const { swaggerSpec } = require('../docs/swagger.config');

function createServerApp() {
    const app = express();

    app.use(express.json());

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get('/status', (req, res) => {
        res.send('ok');
    });

    app.use('/currencies', authMiddleware, createCurrencyRouter());
    app.use('/price', authMiddleware, createPriceRouter());

    return app;
}

module.exports = {
    createServerApp,
};