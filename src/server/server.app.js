const express = require('express');
const { createCurrencyRouter } = require('../currency/currency.router');
const { authMiddleware } = require('../auth/auth.middleware');

function createServerApp() {
    const app = express();

    app.use(express.json());

    app.get('/status', (req, res) => {
        res.send('ok');
    });

    app.use('/currencies', authMiddleware, createCurrencyRouter());

    return app;
}

module.exports = {
    createServerApp,
};