import { ZodError } from 'zod';
import { TransactionNotFoundError } from '../../errors/transaction.js';
import { deleteTransactionSchema } from '../../schemas/transaction.js';
import {
    badRequest,
    forbiddenResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js';
import { ForbiddenError } from '../../errors/user.js';

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase;
    }
    async execute(httpRequest) {
        try {
            const { transactionId, userId } = httpRequest.params;

            await deleteTransactionSchema.parseAsync({ transactionId, userId });

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    transactionId,
                    userId,
                );

            return ok(deletedTransaction);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error.errors[0].message);
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse();
            }

            if (error instanceof ForbiddenError) {
                return forbiddenResponse();
            }

            return serverError();
        }
    }
}
