import {
    badRequest,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js';
import { UserNotFoundError } from '../../errors/user.js';
import { getUserBalanceSchema } from '../../schemas/user.js';
import { ZodError } from 'zod';

export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase;
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;
            const from = httpRequest.query.from;
            const to = httpRequest.query.to;

            await getUserBalanceSchema.parseAsync({
                userId,
                from,
                to,
            });

            const balance = await this.getUserBalanceUseCase.execute(
                httpRequest.params.userId,
                httpRequest.query.from,
                httpRequest.query.to,
            );

            return ok(balance);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                });
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }

            console.log(error);
            return serverError();
        }
    }
}
