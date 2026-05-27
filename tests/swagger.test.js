const { swaggerSpec } = require('../src/docs/swagger.config');

describe('swagger documentation', () => {
    test('contains OpenAPI description for existing routes', () => {
        expect(swaggerSpec.openapi).toBe('3.0.0');
        expect(swaggerSpec.paths['/currencies']).toBeDefined();
        expect(swaggerSpec.paths['/currencies/{id}']).toBeDefined();
        expect(swaggerSpec.components.securitySchemes.bearerAuth).toBeDefined();
    });
});