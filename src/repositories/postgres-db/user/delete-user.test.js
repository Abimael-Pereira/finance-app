import { PostgresDeleteUserRepository } from './delete-user';
import { user } from '../../../tests';
import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/user.js';

describe('DeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({ data: user });
        const sut = new PostgresDeleteUserRepository();

        const result = await sut.execute(user.id);

        expect(result).toStrictEqual(user);
    });

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user });
        const sut = new PostgresDeleteUserRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'delete');

        await sut.execute(user.id);

        expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } });
    });

    it('should throw UserNotFoundError if user not foud', async () => {
        const sut = new PostgresDeleteUserRepository();

        const result = sut.execute(user.id);

        await expect(result).rejects.toThrow(new UserNotFoundError(user.id));
    });

    it('should throw generic error if Prisma throw generic error', async () => {
        const sut = new PostgresDeleteUserRepository();

        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error());

        const result = sut.execute(user.id);

        await expect(result).rejects.toThrow();
    });
});
