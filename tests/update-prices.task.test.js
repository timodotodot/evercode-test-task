const currencyRepository = require('../src/currency/currency.repository');
const priceRepository = require('../src/price/price.repository');
const binanceClient = require('../src/price/binance.client');
const { createUpdatePricesTask } = require('../src/scheduler/tasks/update-prices.task');
const { initDatabase, closeDatabase } = require('../src/database/database');

jest.mock('../src/price/binance.client');

describe('updatePricesTask', () => {
    const logger = {
        info: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        await initDatabase();
        await priceRepository.clear();
        await currencyRepository.clear();
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    test('fetches Binance prices and saves matching pairs', async () => {
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

        const task = createUpdatePricesTask(logger, {
            requestId: 'request-1',
        });

        await task();

        const savedPrices = await priceRepository.findByCurrencyTicker('BTC');

        expect(savedPrices).toEqual([
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
});