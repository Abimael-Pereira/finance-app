import { UnauthorizedError } from '../../errors/user';
import { RefreshTokenUseCase } from './refresh-token';

describe('RefreshTokenUseCase', () => {
    class TokenVerifierAdapterStub {
        execute() {
            return true;
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            };
        }
    }

    const makeSut = () => {
        const tokenVerifierAdapter = new TokenVerifierAdapterStub();
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();
        const refreshTokenUseCase = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        );
        return {
            refreshTokenUseCase,
            tokenVerifierAdapter,
            tokensGeneratorAdapter,
        };
    };

    it('should return new tokens on success', () => {
        const { refreshTokenUseCase } = makeSut();

        const refreshToken = 'valid_refresh_token';

        expect(refreshTokenUseCase.execute(refreshToken)).toEqual({
            accessToken: 'any_access_token',
            refreshToken: 'any_refresh_token',
        });
    });

    it('should throw UnauthorizedError if token is invalid', () => {
        const { refreshTokenUseCase, tokenVerifierAdapter } = makeSut();

        jest.spyOn(tokenVerifierAdapter, 'execute').mockImplementationOnce(
            () => {
                throw new Error();
            },
        );

        expect(() =>
            refreshTokenUseCase.execute('invalid_refresh_token'),
        ).toThrow(new UnauthorizedError());
    });
});
