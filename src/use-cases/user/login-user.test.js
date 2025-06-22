import { InvalidPasswordError, UserNotFoundError } from '../../errors';
import { LoginUserUseCase } from './login-user';
import { user } from '../../tests/index.js';

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute(email) {
            return {
                ...user,
                email,
            };
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true;
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access',
                refreshToken: 'any_refresh',
            };
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const passwordComparatorAdapter = new PasswordComparatorAdapterStub();
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();
        const loginUserUseCase = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        );

        return {
            getUserByEmailRepository,
            loginUserUseCase,
            passwordComparatorAdapter,
        };
    };

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { loginUserUseCase, getUserByEmailRepository } = makeSut();

        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        await expect(
            loginUserUseCase.execute('jhon@doe.com', 'password123'),
        ).rejects.toThrow(new UserNotFoundError());
    });

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { loginUserUseCase, passwordComparatorAdapter } = makeSut();

        jest.spyOn(passwordComparatorAdapter, 'execute').mockResolvedValueOnce(
            false,
        );

        await expect(loginUserUseCase.execute()).rejects.toThrow(
            new InvalidPasswordError(),
        );
    });

    it('should return user with tokens if login is successful', async () => {
        const { loginUserUseCase } = makeSut();

        const result = await loginUserUseCase.execute(
            user.email,
            'password123',
        );

        expect(result.tokens).toBeDefined();
    });
});
