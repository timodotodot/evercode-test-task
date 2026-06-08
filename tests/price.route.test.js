const request = require('supertest');
const { createServerApp } = require('../src/server/server.app');
const currencyRepository = require('../src/currency/currency.repository');
const { initDatabase, closeDatabase } = require('../src/database/database');
const binanceClient = require('../src/price/binance.client');

jest.mock('../src/price/binance.client');

const authToken = process.env.AUTH_TOKEN;

describe('price route', () => {
    let app;

    beforeEach(async () => {
        await initDatabase();
        await currencyRepository.clear();
        app = createServerApp();
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    test('return prices for existing currency', async () => {
        await currencyRepository.create({
            name: 'Bitcoin',
            ticker: 'BTC',
        });

        binanceClient.fetchBinancePrices.mockResolvedValue([
            {
                symbol: 'BTCUSDT',
                price: '65000.00000000',
            },
            {
                symbol: 'ETHBTC',
                price: '0.05200000',
            },
            {
                symbol: 'ETHUSDT',
                price: '3400.00000000',
            },
        ]);

        const response = await request(app)
            .get('/price')
            .query({
                currency: 'BTC',
            })
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                symbol: 'BTCUSDT',
                price: '65000.00000000',
            },
            {
                symbol: 'ETHBTC',
                price: '0.05200000',
            },
        ]);
    });

    test('returns 400 when currency parameter is missing', async () => {
        const response = await request(app)
            .get('/price')
            .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(400);
    });
})