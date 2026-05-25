const request = require('supertest');
const { createServerApp } = require('../src/server/server.app');

describe('GET /status', () => {
    test('returns ok response', async () => {
        const app = createServerApp();

        const response = await request(app).get('/status');

        expect(response.status).toBe(200);
        expect(response.text).toBe('ok');
    });
});