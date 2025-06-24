import {
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js';
import { UserNotFoundError } from '../../errors/user.js';
import { getTransactionByUserIdSchema } from '../../schemas/transaction.js';
import { ZodError } from 'zod';

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId;
            const from = httpRequest.query.from;
            const to = httpRequest.query.to;

            await getTransactionByUserIdSchema.parseAsync({ userId, from, to });

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(
                    userId,
                    from,
                    to,
                );

            return ok(transactions);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error.errors[0].message);
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
