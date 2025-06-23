import { auth } from '../middlewares/auth.js';
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transaction.js';
import { Router } from 'express';

export const transactionsRouter = Router();

transactionsRouter.post('/', auth, async (request, response) => {
    const createTransactionController = makeCreateTransactionController();

    const { statusCode, body } = await createTransactionController.execute({
        ...request,
        body: { ...request.body, userId: request.userId },
    });

    response.status(statusCode).send(body);
});

transactionsRouter.get('/', auth, async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByIdController();

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute({
            ...request,
            query: { ...request.query, userId: request.userId },
        });

    response.status(statusCode).send(body);
});

transactionsRouter.patch('/:transactionId', auth, async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController();

    const { statusCode, body } = await updateTransactionController.execute({
        ...request,
        params: { ...request.params, userId: request.userId },
    });

    response.status(statusCode).send(body);
});

transactionsRouter.delete(
    '/:transactionId',
    auth,
    async (request, response) => {
        const deleteTransactionController = makeDeleteTransactionController();

        const { statusCode, body } =
            await deleteTransactionController.execute(request);

        response.status(statusCode).send(body);
    },
);
