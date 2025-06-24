import { ZodError } from 'zod';
import { UnauthorizedError } from '../../errors/index.js';
import { refreshTokenSchema } from '../../schemas/user.js';
import {
    badRequest,
    ok,
    serverError,
    unauthorizedResponse,
} from '../helpers/index.js';

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase;
    }
    async execute(httpRequest) {
        try {
            const { refreshToken } = httpRequest.body;

            await refreshTokenSchema.parseAsync({ refreshToken });

            const response = this.refreshTokenUseCase.execute(refreshToken);

            return ok(response);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.errors[0].message,
                });
            }

            if (error instanceof UnauthorizedError) {
                return unauthorizedResponse();
            }

            return serverError();
        }
    }
}
