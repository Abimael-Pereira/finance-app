import request from 'supertest';
import { app } from '../app.js';
import { user, transactionWithoutId } from '../tests/index.js';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { faker } from '@faker-js/faker';

dayjs.extend(dayjsPluginUTC);

describe('TransactionsRoutes E2E Tests', () => {
    it('POST /api/transactions should return 201 when creating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .post('/api/transactions')
            .send({ ...transactionWithoutId, userId: createdUser.id });

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(createdUser.id);
        expect(response.body.type).toBe(transactionWithoutId.type);
        expect(response.body.amount).toBe(String(transactionWithoutId.amount));
        expect(response.body.name).toBe(transactionWithoutId.name);
        expect(dayjs(response.body).date()).toBe(
            dayjs(transactionWithoutId).date(),
        );
    });

    it('GET /api/transactions?userId should return 200 when fetching transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const transactionParams = {
            ...transactionWithoutId,
            userId: createdUser.id,
        };

        const createdTransaction = await request(app)
            .post('/api/transactions')
            .send(transactionParams);

        const response = await request(app).get('/api/transactions').query({
            userId: createdUser.id,
        });

        expect(response.status).toBe(200);
        expect(response.body[0].id).toBe(createdTransaction.body.id);
        expect(response.body[0].userId).toBe(createdUser.id);
        expect(response.body[0].type).toBe(transactionParams.type);
        expect(response.body[0].amount).toBe(String(transactionParams.amount));
        expect(response.body[0].name).toBe(transactionParams.name);
        expect(dayjs(response.body[0].date).date()).toBe(
            dayjs(transactionParams.date).date(),
        );
    });

    it('PATCH /api/transactions/:transactionId should return 200 when updating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const transactionParams = {
            ...transactionWithoutId,
            userId: createdUser.id,
        };

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send(transactionParams);

        const updatedTransaction = {
            ...transactionWithoutId,
            userId: undefined, // userId should not be updated
            name: 'Updated Transaction',
        };

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send(updatedTransaction);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdTransaction.id);
        expect(response.body.userId).toBe(createdUser.id);
        expect(response.body.type).toBe(updatedTransaction.type);
        expect(response.body.amount).toBe(String(updatedTransaction.amount));
        expect(response.body.name).toBe(updatedTransaction.name);
        expect(dayjs(response.body.date).date()).toBe(
            dayjs(updatedTransaction.date).date(),
        );
    });

    it('DELETE /api/transactions/:transactionId should return 200 when deleting a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const transactionParams = {
            ...transactionWithoutId,
            userId: createdUser.id,
        };

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send(transactionParams);

        const response = await request(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdTransaction.id);
        expect(response.body.userId).toBe(createdUser.id);
        expect(response.body.type).toBe(createdTransaction.type);
        expect(response.body.amount).toBe(String(createdTransaction.amount));
        expect(response.body.name).toBe(createdTransaction.name);
        expect(dayjs(response.body.date).date()).toBe(
            dayjs(createdTransaction.date).date(),
        );
    });

    it('PATCH /api/transactions/:transactionId should return 404 when transaction does not exist', async () => {
        const response = await request(app)
            .patch(`/api/transactions/${faker.string.uuid()}`)
            .send({ name: 'Updated Transaction' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Transaction not found.');
    });

    it('DELETE /api/transactions/:transactionId should return 404 when transaction does not exist', async () => {
        const response = await request(app).delete(
            `/api/transactions/${faker.string.uuid()}`,
        );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Transaction not found.');
    });

    it('GET /api/transactions should return 400 when user not found', async () => {
        const response = await request(app).get('/api/transactions').query({
            userId: faker.string.uuid(),
        });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found.');
    });

    it('GET /api/transactions should return 400 when userId is not provided', async () => {
        const response = await request(app).get('/api/transactions');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('The field userID is required');
    });
});
