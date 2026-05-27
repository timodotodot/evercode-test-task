const BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';

async function fetchBinancePrices() {
    const response = await fetch(BINANCE_API_URL, {
        signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
        throw new Error(`Binance API responded with status ${response.status}`);
    }

    const prices = await response.json();

    if (!Array.isArray(prices)) {
        throw new Error('Binance API returned invalid response');
    }

    return prices;
}

module.exports = {
    fetchBinancePrices,
};