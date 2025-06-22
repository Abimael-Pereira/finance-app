import { InvalidPasswordError, UserNotFoundError } from '../../errors';
import { user } from '../../tests/';
import { LoginUserController } from './login-user';

describe('LoginUserController', () => {
    class LoginUserUseCaseStub {
        async execute(email, password) {
            // Simulate a successful login
            return {
                ...user,
                email,
                password,
                tokens: {
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token',
                },
            };
        }
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub();
        const loginUserController = new LoginUserController(loginUserUseCase);
        return { loginUserController, loginUserUseCase };
    };

    const httpRequestValid = {
        body: {
            email: user.email,
            password: user.password,
        },
    };

    it('should return 200 with user and tokens on successful login', async () => {
        const { loginUserController } = makeSut();

        expect(await loginUserController.execute(httpRequestValid)).toEqual({
            statusCode: 200,
            body: {
                ...user,
                tokens: {
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token',
                },
            },
        });
    });

    it('should return 400 if email validation fails', async () => {
        const { loginUserController } = makeSut();

        const httpRequest = {
            body: {
                email: 'invalid-email',
                password: user.password,
            },
        };

        expect(await loginUserController.execute(httpRequest)).toEqual({
            statusCode: 400,
            body: {
                message: 'Please, provide a valid email.',
            },
        });
    });

    it('should return 400 if password validation fails', async () => {
        const { loginUserController } = makeSut();

        const httpRequest = {
            body: {
                email: user.email,
                password: 'short',
            },
        };

        expect(await loginUserController.execute(httpRequest)).toEqual({
            statusCode: 400,
            body: {
                message: 'Password must have at least 6 characters',
            },
        });
    });

    it('should return 404 if user is not found', async () => {
        const { loginUserController, loginUserUseCase } = makeSut();

        jest.spyOn(loginUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        );

        expect(await loginUserController.execute(httpRequestValid)).toEqual({
            statusCode: 404,
            body: {
                message: 'User not found',
            },
        });
    });

    it('should return 401 if password is invalid', async () => {
        const { loginUserController, loginUserUseCase } = makeSut();

        jest.spyOn(loginUserUseCase, 'execute').mockRejectedValueOnce(
            new InvalidPasswordError(),
        );

        expect(await loginUserController.execute(httpRequestValid)).toEqual({
            statusCode: 401,
            body: {
                message: 'Invalid password',
            },
        });
    });

    it('should return 500 if an unexpected error occurs', async () => {
        const { loginUserController, loginUserUseCase } = makeSut();

        jest.spyOn(loginUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        expect(await loginUserController.execute(httpRequestValid)).toEqual({
            statusCode: 500,
            body: {
                message: 'Internal server error',
            },
        });
    });
});
