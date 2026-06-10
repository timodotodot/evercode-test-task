const currencyRepository = require('../../currency/currency.repository');
const priceRepository = require('../../price/price.repository');
const { fetchBinancePrices } = require('../../price/binance.client');

function createUpdatePricesTask(logger, options = {}) {
    return async function updatePricesTask() {
        const currencies = await currencyRepository.findAll();
        const binancePrices = await fetchBinancePrices();

        for (const currency of currencies) {
            const ticker = currency.ticker.toUpperCase();

            const filteredPrices = binancePrices.filter((item) => (
                typeof item.symbol === 'string' &&
                item.symbol.includes(ticker)
            ))

            await priceRepository.replacePricesForTicker(ticker, filteredPrices);

            logger.info(`Updated prices for ${ticker}`, {
                requestId: options.requestId,
                context: {
                    ticker,
                    count: filteredPrices.length,
                }
            });
        }
    }
}

module.exports = {
    createUpdatePricesTask,
}