const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { createCurrencyRouter } = require('../currency/currency.router');
const { authMiddleware } = require('../auth/auth.middleware');
const { swaggerSpec } = require('../docs/swagger.config');

function createServerApp() {
    const app = express();

    app.use(express.json());

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    /**
     * @openapi
     * /status:
     *   get:
     *     summary: Проверка статуса сервера
     *     tags:
     *       - System
     *     responses:
     *       200:
     *         description: Server is running
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: ok
     */
    app.get('/status', (req, res) => {
        res.send('ok');
    });

    app.use('/currencies', authMiddleware, createCurrencyRouter());

    return app;
}

module.exports = {
    createServerApp,
};