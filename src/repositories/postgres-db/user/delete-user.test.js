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

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresDeleteUserRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'delete');

        await sut.execute(user.id);

        expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } });
    });
});
