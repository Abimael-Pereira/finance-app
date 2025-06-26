import { auth } from '../middlewares/auth.js';
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js';
import { Router } from 'express';

export const transactionsRouter = Router();

transactionsRouter.post('/me', auth, async (request, response) => {
    const createTransactionController = makeCreateTransactionController();

    const { statusCode, body } = await createTransactionController.execute({
        ...request,
        body: { ...request.body, userId: request.userId },
    });

    response.status(statusCode).send(body);
});

transactionsRouter.get('/me', auth, async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByIdController();

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute({
            ...request,
            query: { ...request.query, userId: request.userId },
        });

    response.status(statusCode).send(body);
});

transactionsRouter.patch(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const updateTransactionController = makeUpdateTransactionController();

        const { statusCode, body } = await updateTransactionController.execute({
            ...request,
            params: { ...request.params, userId: request.userId },
        });

        response.status(statusCode).send(body);
    },
);

transactionsRouter.delete(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const deleteTransactionController = makeDeleteTransactionController();

        const { statusCode, body } = await deleteTransactionController.execute({
            ...request,
            userId: request.userId,
        });

        response.status(statusCode).send(body);
    },
);
