const crypto = require('crypto');
const config = require('../config/app.config');

function safeCompare(value, expectedValue) {
    if (!value || !expectedValue || value.length !== expectedValue.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        Buffer.from(value),
        Buffer.from(expectedValue),
    );
}

function authMiddleware(req, res, next) {
    const authHeader = req.get('authorization');

    if (!authHeader) {
        return res.sendStatus(403);
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !safeCompare(token, config.auth.token)) {
        return res.sendStatus(403);
    }

    return next();
}

module.exports = {
    authMiddleware,
};