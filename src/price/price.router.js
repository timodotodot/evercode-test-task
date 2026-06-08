const express = require('express');
const currencyRepository = require('../currency/currency.repository');
const { fetchBinancePrices } = require('./binance.client');

function createPriceRouter() {
    const router = express.Router();

    /**
     * @openapi
     * /price:
     *   get:
     *     summary: Получить цены с Binance для заданного тикера валюты
     *     tags:
     *       - Price
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: currency
     *         in: query
     *         required: true
     *         schema:
     *           type: string
     *         example: BTC
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   symbol:
     *                     type: string
     *                     example: BTCUSDT
     *                   price:
     *                     type: string
     *                     example: '65000.00000000'
     *       400:
     *         description: Missing currency query parameter
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Currency not found
     *       502:
     *         description: Failed to fetch prices from Binance
     */
    router.get('/', async (req, res) => {
        const currency = req.query.currency;

        if (!currency || typeof currency !== 'string') {
            return res.status(400).json({
                message: 'currency query parameter is required',
            });
        }

        const ticker = currency.trim().toUpperCase();
        const savedCurrency = await currencyRepository.findByTicker(ticker);

        if (!savedCurrency) {
            return res.status(404).json({
                message: 'Currency not found',
            });
        }

        try {
            const prices = await fetchBinancePrices();
            const filteredPrices = prices.filter((item) => item.symbol.includes(ticker));

            return res.json(filteredPrices);
        } catch (error) {
            return res.status(502).json({
                message: 'Failed to fetch prices from Binance',
            });
        }
    });

    return router;
}

module.exports = {
    createPriceRouter,
};