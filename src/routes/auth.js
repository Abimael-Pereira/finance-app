import { Router } from 'express';
import {
    makeLoginUserController,
    makeRefreshTokenController,
} from '../factories/controllers/user.js';

export const authRouter = Router();

authRouter.post('/login', async (request, response) => {
    const loginUserController = makeLoginUserController();
    const { statusCode, body } = await loginUserController.execute(request);

    response.status(statusCode).send(body);
});

authRouter.post('/refresh-token', async (request, response) => {
    const refreshTokenController = makeRefreshTokenController();
    const { statusCode, body } = await refreshTokenController.execute(request);
    response.status(statusCode).send(body);
});
