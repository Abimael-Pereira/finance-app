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

    it('GET /api/user/me should return 200 if user is authenticated', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ...createdUser,
            tokens: undefined,
        });
    });

    it('PATCH /api/users/me should return 200 when user is updated', async () => {
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
            .patch('/api/users/me')
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

    it('DELETE /api/users/me should return 200 when user is deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ...createdUser, tokens: undefined });
    });

    it('GET /api/users/me/balance should return 200 when get user balance', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                userId: createdUser.id,
                type: TransactionType.EARNING,
                amount: 5000,
            });

        await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                userId: createdUser.id,
                type: TransactionType.EXPENSE,
                amount: 2000,
            });

        await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                name: faker.commerce.productName(),
                date: faker.date.recent().toISOString(),
                userId: createdUser.id,
                type: TransactionType.INVESTMENT,
                amount: 1000,
            });

        const from = '2025-01-01';
        const to = '2025-12-31';

        const response = await request(app)
            .get(`/api/users/me/balance?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            balance: '2000',
            earnings: '5000',
            expenses: '2000',
            investments: '1000',
            earningsPercentage: '62',
            expensesPercentage: '25',
            investmentsPercentage: '12',
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
});
