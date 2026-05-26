const currencies = [];
let nextId = 1;

function findAll() {
    return currencies;
}

function findById(id) {
    return currencies.find(c => c.id === id);
}

function findByTicker(ticker) {
    return currencies.find(c => c.ticker === ticker);
}

function create(data) {
    const currency = {
        id: nextId++,
        name: data.name,
        ticker: data.ticker,
    }

    currencies.push(currency);
    
    return currency;
}

function update(id, data) {
    const currency = findById(id);
    
    if (!currency) {
        return null;
    }

    if (data.name !== undefined) {
        currency.name = data.name;
    }

    if (data.ticker !== undefined) {
        currency.ticker = data.ticker;
    }

    return currency;
}

function remove(id) {
    const index = currencies.findIndex(c => c.id === id);

    if (index === -1) {
        return false;
    }

    currencies.splice(index, 1);
    
    return true;
}

function clear() {
    currencies.length = 0;
    nextId = 1;
}

module.exports = {
    findAll,
    findById,
    findByTicker,
    create,
    update,
    remove,
    clear,
}