import { user } from '../tests/index.js';
import { app } from '../app.js';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { TransactionType } from '@prisma/client';

describe('UserRoutes E2E Tests', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        expect(response.status).toBe(201);
    });

    it('GET /api/user should return 200 when user is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ...createdUser,
            tokens: undefined,
        });
    });

    it('PATCH /api/users should return 200 when user is updated', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        const response = await request(app)
            .patch('/api/users')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(updateUserParams);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ...updateUserParams,
            id: createdUser.id,
            password: response.body.password,
        });
        expect(response.body.password).not.toBe(updateUserParams.password);
    });

    it('DELETE /api/users should return 200 when user is deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .delete('/api/users')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...createdUser, tokens: undefined });
    });

    it('GET /api/users/balance should return 200 when get user balance', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                userId: createdUser.id,
                type: TransactionType.EARNING,
                amount: 5000,
            });

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                userId: createdUser.id,
                type: TransactionType.EXPENSE,
                amount: 2000,
            });

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                userId: createdUser.id,
                type: TransactionType.INVESTMENT,
                amount: 1000,
            });

        const response = await request(app)
            .get('/api/users/balance')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            balance: '2000',
            earnings: '5000',
            expenses: '2000',
            investments: '1000',
        });
    });

    it('POST /api/users should return 400 when the provided email is already in use', async () => {
        await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: `The e-mail ${user.email} is already in use`,
        });
    });

    it('POST /api/users/login should return 200 when user logs in successfully', async () => {
        await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app).post('/api/users/login').send({
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

    it('POST /api/users/refresh-token shound return 200 when refresh token is valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });
});
