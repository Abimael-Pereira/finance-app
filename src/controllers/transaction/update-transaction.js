import { ZodError } from 'zod';
import { updateTransactionSchema } from '../../schemas/index.js';
import {
    badRequest,
    checkIfIdIsValid,
    forbiddenResponse,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js';
import { TransactionNotFoundError } from '../../errors/transaction.js';
import { ForbiddenError } from '../../errors/user.js';

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase;
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(
                httpRequest.params.transactionId,
            );
            if (!idIsValid) {
                return invalidIdResponse();
            }

            const updateTransactionParams = httpRequest.body;

            await updateTransactionSchema.parseAsync(updateTransactionParams);

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                httpRequest.params.userId,
                updateTransactionParams,
            );

            return ok(transaction);
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
