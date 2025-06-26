import { PasswordComparatorAdapter } from './password-comparator';
import { PasswordHasherAdapter } from './password-hasher';

describe('PasswordComparatorAdapter', () => {
    const passwordHasher = new PasswordHasherAdapter();
    const sut = new PasswordComparatorAdapter();

    it('should compare passwords correctly', async () => {
        const password = 'testPassword';
        const hashedPassword = await passwordHasher.execute(password);

        const isMatch = await sut.execute(password, hashedPassword);
        expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
        const password = 'testPassword';
        const hashedPassword = await passwordHasher.execute(password);

        const isMatch = await sut.execute('wrongPassword', hashedPassword);
        expect(isMatch).toBe(false);
    });
});
