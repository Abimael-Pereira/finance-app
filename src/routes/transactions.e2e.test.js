import request from 'supertest';
import { app } from '../app.js';
import { user, transactionWithoutId } from '../tests/index.js';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { faker } from '@faker-js/faker';

dayjs.extend(dayjsPluginUTC);

describe('TransactionsRoutes E2E Tests', () => {
    it('GET /api/transactions/me should return 200 when fetching transactions successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const createdTransaction = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(transactionWithoutId);

        const from = '2025-01-01';
        const to = '2025-12-31';

        const response = await request(app)
            .get(`/api/transactions/me?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0].id).toBe(createdTransaction.body.id);
        expect(response.body[0].userId).toBe(createdUser.id);
        expect(response.body[0].type).toBe(transactionWithoutId.type);
        expect(response.body[0].amount).toBe(
            String(transactionWithoutId.amount),
        );
        expect(response.body[0].name).toBe(transactionWithoutId.name);
        expect(dayjs.utc(response.body[0].date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transactionWithoutId.date).format('YYYY-MM-DD'),
        );
    });

    it('PATCH /api/transactions/me/:transactionId should return 200 when updating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(transactionWithoutId);

        const updatedTransaction = {
            name: 'Updated Transaction',
        };

        const response = await request(app)
            .patch(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(updatedTransaction);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdTransaction.id);
        expect(response.body.userId).toBe(createdUser.id);
        expect(response.body.type).toBe(createdTransaction.type);
        expect(response.body.amount).toBe(String(createdTransaction.amount));
        expect(response.body.name).toBe(updatedTransaction.name);
        expect(dayjs.utc(response.body.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transactionWithoutId.date).format('YYYY-MM-DD'),
        );
    });

    it('DELETE /api/transactions/me should return 200 when deleting a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const deleteTransactionWithoutId = {
            ...transactionWithoutId,
            userId: createdUser.id,
        };

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(deleteTransactionWithoutId);

        const response = await request(app)
            .delete(`/api/transactions/me/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdTransaction.id);
    });

    it('POST /api/transactions/me should return 201 when creating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .post('/api/transactions/me')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(transactionWithoutId);

        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(createdUser.id);
        expect(response.body.type).toBe(transactionWithoutId.type);
        expect(response.body.amount).toBe(String(transactionWithoutId.amount));
        expect(response.body.name).toBe(transactionWithoutId.name);
        expect(dayjs.utc(response.body.date).format('YYYY-MM-DD')).toBe(
            dayjs.utc(transactionWithoutId.date).format('YYYY-MM-DD'),
        );
    });

    it('GET /api/transactions/me should return 400 when queryParams is invalid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .get('/api/transactions/me')
            .query({
                userId: createdUser.id,
                from: 'invalid-date',
                to: '2025-12-31',
            })
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            'From date must be a valid date string',
        );
    });

    it('PATCH /api/transactions/me/:transactionId should return 404 when transaction does not exist', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .patch(`/api/transactions/me/${faker.string.uuid()}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({ name: 'Updated Transaction' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Transaction not found');
    });

    it('DELETE /api/transactions/me should return 404 when transaction does not exist', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined });

        const response = await request(app)
            .delete(`/api/transactions/me/${faker.string.uuid()}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Transaction not found');
    });
});
