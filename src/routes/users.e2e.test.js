import { user } from '../tests/index.js';
import { app } from '../../index.js';
import request from 'supertest';

describe('UserRoutes E2E Tests', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        expect(response.status).toBe(201);
    });
});
