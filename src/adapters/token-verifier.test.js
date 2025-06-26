import { faker } from '@faker-js/faker';
import { TokenVerifierAdapter } from './token-verifier';
import { TokensGeneratorAdapter } from './tokens-generator';

describe('TokenVerifierAdapter', () => {
    const tokensGenerator = new TokensGeneratorAdapter();
    const sut = new TokenVerifierAdapter();

    it('should verify a token with the provided secret key', () => {
        const userId = faker.string.uuid();
        const secret = process.env.JWT_ACCESS_TOKEN_SECRET;

        const tokens = tokensGenerator.execute(userId);
        const sutSpy = jest.spyOn(sut, 'execute');

        const result = sut.execute(tokens.accessToken, secret);

        expect(sutSpy).toHaveBeenCalledWith(tokens.accessToken, secret);
        expect(result.userId).toEqual(userId);
    });

    it('should throw an error if verification fails', () => {
        const token = 'invalid.token';
        const secretKey = 'secret';

        expect(() => sut.execute(token, secretKey)).toThrow();
    });
});
