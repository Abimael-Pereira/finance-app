import { user } from '../../../tests';
import { prisma } from '../../../../prisma/prisma';
import { PostgresGetUserByEmailRepository } from './get-user-by-email';

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        await prisma.user.create({ data: user });

        const sut = new PostgresGetUserByEmailRepository();

        const result = await sut.execute(user.email);

        expect(result).toStrictEqual(user);
    });
});
