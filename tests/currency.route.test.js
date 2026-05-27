const request = require('supertest');
const { createServerApp } = require('../src/server/server.app');
const currencyRepository = require('../src/currency/currency.repository');

const authToken = process.env.AUTH_TOKEN;

describe('currency routes', () => {
    let app;

    beforeEach(() => {
        currencyRepository.clear();
        app = createServerApp();
    });

    test('creates and returns currency', async () => {
        const createResponse = await request(app)
            .post('/currencies')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Bitcoin',
                ticker: 'BTC',
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body).toEqual({
            id: 1,
            name: 'Bitcoin',
            ticker: 'BTC',
        });

        const listResponse = await request(app)
            .get('/currencies')
            .set('Authorization', `Bearer ${authToken}`);

        expect(listResponse.status).toBe(200);
        expect(listResponse.body).toEqual([
            {
                id: 1,
                name: 'Bitcoin',
                ticker: 'BTC',
            },
        ]);
    });

    test('returns currency by id', async () => {
        const createResponse = await request(app)
            .post('/currencies')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Ethereum',
                ticker: 'ETH',
            });

        const response = await request(app)
            .get(`/currencies/${createResponse.body.id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'Ethereum',
            ticker: 'ETH',
        });
    });

    test('updates currency', async () => {
        const createResponse = await request(app)
            .post('/currencies')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Bitcoin',
                ticker: 'BTC',
            });

        const updateResponse = await request(app)
            .patch(`/currencies/${createResponse.body.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Ethereum',
                ticker: 'ETH',
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body).toEqual({
            id: 1,
            name: 'Ethereum',
            ticker: 'ETH',
        });
    });

    test('deletes currency', async () => {
        const createResponse = await request(app)
            .post('/currencies')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Bitcoin',
                ticker: 'BTC',
            });

        const deleteResponse = await request(app)
            .delete(`/currencies/${createResponse.body.id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(deleteResponse.status).toBe(204);

        const listResponse = await request(app)
            .get('/currencies')
            .set('Authorization', `Bearer ${authToken}`);

        expect(listResponse.status).toBe(200);
        expect(listResponse.body).toEqual([]);
    });
});