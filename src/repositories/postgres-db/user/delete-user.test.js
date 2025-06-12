import { PostgresDeleteUserRepository } from './delete-user';
import { user } from '../../../tests';
import { prisma } from '../../../../prisma/prisma.js';

describe('DeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({ data: user });
        const sut = new PostgresDeleteUserRepository();

        const result = await sut.execute(user.id);

        expect(result).toStrictEqual(user);
    });
});
