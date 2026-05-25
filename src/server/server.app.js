const express = require('express');

function createServerApp() {
    const app = express();

    app.get('/status', (req, res) => {
        res.send('ok');
    });

    return app;
}

module.exports = {
    createServerApp,
};