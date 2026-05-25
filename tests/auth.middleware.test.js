const request = require('supertest');
const express = require('express');
const { authMiddleware } = require('../src/auth/auth.middleware');

describe('authMiddleware', () => {
    test('returns 403 when authorization header is missing', async () => {
        const app = express();

        app.get('/protected', authMiddleware, (req, res) => {
            res.send('ok');
        });

        const response = await request(app).get('/protected');

        expect(response.status).toBe(403);
    });

    test('returns 403 when token is invalid', async () => {
        const app = express();

        app.get('/protected', authMiddleware, (req, res) => {
            res.send('ok');
        });

        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer wrong-token');

        expect(response.status).toBe(403);
    });

    test('passes request when token is valid', async () => {
        const app = express();

        app.get('/protected', authMiddleware, (req, res) => {
            res.send('ok');
        });

        const response = await request(app)
            .get('/protected')
            .set(
                'Authorization',
                'Bearer 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            );

        expect(response.status).toBe(200);
        expect(response.text).toBe('ok');
    });
});