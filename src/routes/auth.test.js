import request from 'supertest';
import { app } from '../app.js';
import { user } from '../tests/index.js';

describe('AuthRoutes', () => {
    it('POST /api/auth/login should return 200 when user logs in successfully', async () => {
        await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app).post('/api/auth/login').send({
            email: user.email,
            password: user.password,
        });

        expect(response.status).toBe(200);
        expect(response.body.tokens.accessToken).toBeDefined();
        expect(response.body.tokens.refreshToken).toBeDefined();
        expect(response.body).toEqual({
            id: expect.any(String),
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: expect.any(String),
            tokens: {
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            },
        });
    });

    it('POST /api/auth/refresh-token shound return 200 when refresh token is valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .post('/api/auth/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });
});
