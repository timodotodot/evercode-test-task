const request = require('supertest');
const { createServerApp } = require('../src/server/server.app');
const currencyRepository = require('../src/currency/currency.repository');
const { initDatabase, closeDatabase } = require('../src/database/database');
const priceRepository = require('../src/price/price.repository');

const authToken = process.env.AUTH_TOKEN;

describe('price route', () => {
    let app;

    beforeEach(async () => {
        await initDatabase();
        await priceRepository.clear();
        await currencyRepository.clear();
        
        app = createServerApp();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    test('returns saved prices for existing currency', async () => {
        await currencyRepository.create({
            name: 'Bitcoin',
            ticker: 'BTC',
        });

        await priceRepository.replacePricesForTicker('BTC', [
            {
                symbol: 'BTCUSDT',
                price: '65000.00000000',
                updated_at: expect.any(String),
            },
            {
                symbol: 'ETHBTC',
                price: '0.05200000',
                updated_at: expect.any(String),
            },
        ]);

        const response = await request(app)
            .get('/price')
            .query({ currency: 'BTC' })
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                symbol: 'BTCUSDT',
                price: '65000.00000000',
                updated_at: expect.any(String),
            },
            {
                symbol: 'ETHBTC',
                price: '0.05200000',
                updated_at: expect.any(String),
            },
        ]);
    });

    test('returns 400 when currency parameter is missing', async () => {
        const response = await request(app)
            .get('/price')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(400);
    });

    test('returns 404 when currency is not found', async () => {
        const response = await request(app)
            .get('/price')
            .query({ currency: 'BTC' })
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(404);
    });
});