import { UnauthorizedError } from '../../errors';
import { RefreshTokenController } from './refresh-token';

describe('RefreshTokenController', () => {
    class RefreshTokenUseCaseStub {
        execute(refreshToken) {
            return refreshToken;
        }
    }

    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub();
        const refreshTokenController = new RefreshTokenController(
            refreshTokenUseCase,
        );
        return { refreshTokenController, refreshTokenUseCase };
    };

    const httpRequest = {
        body: {
            refreshToken: 'valid_refresh_token',
        },
    };

    it('should return 200 on success', async () => {
        const { refreshTokenController } = makeSut();
        const response = await refreshTokenController.execute(httpRequest);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(httpRequest.body.refreshToken);
    });

    it('should return 400 if parameter is invalid', async () => {
        const { refreshTokenController } = makeSut();
        const invalidHttpRequest = {
            body: {
                refreshToken: '',
            },
        };
        const response =
            await refreshTokenController.execute(invalidHttpRequest);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Refresh token is required.',
        });
    });

    it('should return 401 if refresh token is invalid', async () => {
        const { refreshTokenController, refreshTokenUseCase } = makeSut();

        jest.spyOn(refreshTokenUseCase, 'execute').mockImplementation(() => {
            throw new UnauthorizedError();
        });

        const response = await refreshTokenController.execute(httpRequest);

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            message: 'Unauthorized',
        });
    });

    it('should return 500 if UseCase throws ServerError', async () => {
        const { refreshTokenController, refreshTokenUseCase } = makeSut();

        jest.spyOn(refreshTokenUseCase, 'execute').mockImplementation(() => {
            throw new Error();
        });

        const response = await refreshTokenController.execute(httpRequest);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({
            message: 'Internal server error',
        });
    });
});
