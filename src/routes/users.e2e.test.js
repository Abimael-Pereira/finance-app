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

    it('GET /api/user/:userId should return 200 when user is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app).get(`/api/users/${createdUser.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(createdUser);
    });

    it('PATCH /api/users/:userId should return 200 when user is updated', async () => {
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
            .patch(`/api/users/${createdUser.id}`)
            .send(updateUserParams);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            ...updateUserParams,
            id: createdUser.id,
            password: response.body.password,
        });
        expect(response.body.password).not.toBe(updateUserParams.password);
    });

    it('DELETE /api/users/:userId should return 200 when user is deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app).delete(
            `/api/users/${createdUser.id}`,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual(createdUser);
    });

    it('GET /api/users/:userId/balance should return 200 when get user balance', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        await request(app).post('/api/transactions').send({
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            userId: createdUser.id,
            type: TransactionType.EARNING,
            amount: 5000,
        });

        await request(app).post('/api/transactions').send({
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            userId: createdUser.id,
            type: TransactionType.EXPENSE,
            amount: 2000,
        });

        await request(app).post('/api/transactions').send({
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            userId: createdUser.id,
            type: TransactionType.INVESTMENT,
            amount: 1000,
        });

        const response = await request(app).get(
            `/api/users/${createdUser.id}/balance`,
        );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            balance: '2000',
            earnings: '5000',
            expenses: '2000',
            investments: '1000',
        });
    });

    it('GET /api/users/:userId should return 404 when user is not found', async () => {
        const nonExistentUserId = faker.string.uuid();
        const response = await request(app).get(
            `/api/users/${nonExistentUserId}`,
        );

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'User not found.',
        });
    });

    it('GET /api/users/:userId/balance should return 404 when user is not found', async () => {
        const nonExistentUserId = faker.string.uuid();
        const response = await request(app).get(
            `/api/users/${nonExistentUserId}/balance`,
        );

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'User not found.',
        });
    });

    it('PATCH /api/users/:userId should return 404 when user is not found', async () => {
        const nonExistentUserId = faker.string.uuid();
        const response = await request(app)
            .patch(`/api/users/${nonExistentUserId}`)
            .send({ first_name: 'Updated' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'User not found.',
        });
    });
});
