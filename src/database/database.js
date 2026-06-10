const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require('../config/app.config');

let database;

async function getDatabase() {
    if (database) {
        return database;
    }

    fs.mkdirSync(path.dirname(config.database.filename), {
        recursive: true,
    });

    database = await open({
        filename: config.database.filename,
        driver: sqlite3.Database,
    });

    await database.exec('PRAGMA foreign_keys = ON');

    return database;
}

async function initDatabase() {
    const db = await getDatabase();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS currencies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ticker TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS price_rates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            currency_ticker TEXT NOT NULL,
            symbol TEXT NOT NULL,
            price TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(currency_ticker, symbol),
            FOREIGN KEY (currency_ticker) REFERENCES currencies(ticker) ON DELETE CASCADE
        );
    `);
}

async function runInTransaction(callback) {
    const db = await getDatabase();

    try {
        await db.exec('BEGIN');
        const result = await callback(db);
        await db.exec('COMMIT');

        return result;
    } catch (error) {
        await db.exec('ROLLBACK');
        throw error;
    }
}

async function closeDatabase() {
    if (!database) {
        return;
    }

    await database.close();
    database = null;
}

module.exports = {
    getDatabase,
    initDatabase,
    runInTransaction,
    closeDatabase,
};