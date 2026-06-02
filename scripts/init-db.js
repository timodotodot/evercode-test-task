const { initDatabase, closeDatabase } = require('../src/database/database');

async function main() {
    try {
        await initDatabase();
        console.log('Database initialized');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exitCode = 1;
    } finally {
        await closeDatabase();
    }
}

main();