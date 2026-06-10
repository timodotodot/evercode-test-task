const { getDatabase, runInTransaction } = require('../database/database');

async function findByCurrencyTicker(currencyTicker) {
    const db = await getDatabase();

    return db.all(`
        SELECT symbol, price, updated_at
        FROM price_rates
        WHERE currency_ticker = ?
        ORDER BY symbol ASC
    `, currencyTicker);
}

async function replacePricesForTicker(currencyTicker, prices) {
    return runInTransaction(async (db) => {
        await db.run(`
            DELETE FROM price_rates
            WHERE currency_ticker = ?
        `, currencyTicker);

        for (const item of prices) {
            await db.run(`
                INSERT INTO price_rates (currency_ticker, symbol, price)
                VALUES (?, ?, ?)
            `, currencyTicker, item.symbol, item.price);
        }
    });
}

async function clear() {
    const db = await getDatabase();

    await db.exec('DELETE FROM price_rates');
    await db.exec("DELETE FROM sqlite_sequence WHERE name = 'price_rates'");
}

module.exports = {
    findByCurrencyTicker,
    replacePricesForTicker,
    clear,
};