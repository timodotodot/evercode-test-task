const { getDatabase, runInTransaction } = require('../database/database');

async function findAll() {
    const db = await getDatabase();

    return db.all(`
        SELECT id, name, ticker
        FROM currencies
        ORDER BY id ASC
    `);
}

async function findById(id) {
    const db = await getDatabase();

    return db.get(`
        SELECT id, name, ticker
        FROM currencies
        WHERE id = ?
    `, id);
}

async function findByTicker(ticker) {
    const db = await getDatabase();

    return db.get(`
        SELECT id, name, ticker
        FROM currencies
        WHERE ticker = ?
    `, ticker);
}

async function create(data) {
    return runInTransaction(async (db) => {
        const result = await db.run(`
            INSERT INTO currencies (name, ticker)
            VALUES (?, ?)
        `, data.name, data.ticker);

        return db.get(`
            SELECT id, name, ticker
            FROM currencies
            WHERE id = ?
        `, result.lastID);
    });
}

async function update(id, data) {
    return runInTransaction(async (db) => {
        const currency = await db.get(`
            SELECT id, name, ticker
            FROM currencies
            WHERE id = ?
        `, id);

        if (!currency) {
            return null;
        }

        const nextName = data.name !== undefined ? data.name : currency.name;
        const nextTicker = data.ticker !== undefined ? data.ticker : currency.ticker;

        await db.run(`
            UPDATE currencies
            SET name = ?, ticker = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, nextName, nextTicker, id);

        return db.get(`
            SELECT id, name, ticker
            FROM currencies
            WHERE id = ?
        `, id);
    });
}

async function remove(id) {
    return runInTransaction(async (db) => {
        const result = await db.run(`
            DELETE FROM currencies
            WHERE id = ?
        `, id);

        return result.changes > 0;
    });
}

async function clear() {
    const db = await getDatabase();

    await db.exec('DELETE FROM currencies');
    await db.exec("DELETE FROM sqlite_sequence WHERE name = 'currencies'");
}

module.exports = {
    findAll,
    findById,
    findByTicker,
    create,
    update,
    remove,
    clear,
};
