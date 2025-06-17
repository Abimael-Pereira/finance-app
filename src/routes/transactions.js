import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js';
import { Router } from 'express';

export const transactionsRouter = Router();

transactionsRouter.post('/', async (request, response) => {
    const createTransactionController = makeCreateTransactionController();

    const { statusCode, body } =
        await createTransactionController.execute(request);

    response.status(statusCode).send(body);
});

transactionsRouter.get('/', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByIdController();

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(request);

    response.status(statusCode).send(body);
});

transactionsRouter.patch('/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController();

    const { statusCode, body } =
        await updateTransactionController.execute(request);

    response.status(statusCode).send(body);
});

transactionsRouter.delete('/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController();

    const { statusCode, body } =
        await deleteTransactionController.execute(request);

    response.status(statusCode).send(body);
});
