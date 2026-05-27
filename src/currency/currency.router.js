const express = require('express');
const currencyRepository = require('./currency.repository');

function isInvalidCurrencyData(data) {
    return !data.name || !data.ticker;
}

function createCurrencyRouter() {
    const router = express.Router();

    /**
     * @openapi
     * /currencies:
     *   get:
     *     summary: Получить список валют
     *     tags:
     *       - Currency
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Currency list
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Currency'
     *       403:
     *         description: Forbidden
     */
    router.get('/', (req, res) => {
        const currencies = currencyRepository.findAll();

        return res.json(currencies);
    });

    /**
     * @openapi
     * /currencies/{id}:
     *   get:
     *     summary: Получить валюту по id
     *     tags:
     *       - Currency
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Currency
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Currency'
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Currency not found
     */
    router.get('/:id', (req, res) => {
        const currency = currencyRepository.findById(Number(req.params.id));

        if (!currency) {
            return res.sendStatus(404);
        }

        return res.json(currency);
    });

    /**
     * @openapi
     * /currencies:
     *   post:
     *     summary: Создать валюту
     *     tags:
     *       - Currency
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateCurrencyRequest'
     *     responses:
     *       201:
     *         description: Currency created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Currency'
     *       400:
     *         description: Invalid request body
     *       403:
     *         description: Forbidden
     */
    router.post('/', (req, res) => {
        if (isInvalidCurrencyData(req.body)) {
            return res.sendStatus(400);
        }

        const currency = currencyRepository.create({
            name: req.body.name.trim(),
            ticker: req.body.ticker.trim().toUpperCase(),
        });

        return res.status(201).json(currency);
    });

    /**
     * @openapi
     * /currencies/{id}:
     *   patch:
     *     summary: Обновить валюту
     *     tags:
     *       - Currency
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateCurrencyRequest'
     *     responses:
     *       200:
     *         description: Currency updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Currency'
     *       400:
     *         description: Invalid request body
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Currency not found
     */
    router.patch('/:id', (req, res) => {
        const currency = currencyRepository.update(Number(req.params.id), {
            name: req.body.name?.trim(),
            ticker: req.body.ticker?.trim().toUpperCase(),
        });

        if (!currency) {
            return res.sendStatus(404);
        }

        return res.json(currency);
    });

    /**
     * @openapi
     * /currencies/{id}:
     *   delete:
     *     summary: Удалить валюту
     *     tags:
     *       - Currency
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       204:
     *         description: Currency deleted
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Currency not found
     */
    router.delete('/:id', (req, res) => {
        const deleted = currencyRepository.remove(Number(req.params.id));

        if (!deleted) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);
    });

    return router;
}

module.exports = {
    createCurrencyRouter,
};