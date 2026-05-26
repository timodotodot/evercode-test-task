const express = require('express');
const currencyRepository = require('./currency.repository');

function isInvalidCurrencyData(data) {
    return !data.name || !data.ticker;
}

function createCurrencyRouter() {
    const router = express.Router();

    router.get('/', (req, res) => {
        const currencies = currencyRepository.findAll();

        return res.json(currencies);
    });

    router.get('/:id', (req, res) => {
        const currency = currencyRepository.findById(Number(req.params.id));

        if (!currency) {
            return res.sendStatus(404);
        }

        return res.json(currency);
    });

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