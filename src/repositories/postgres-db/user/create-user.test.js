import { user } from '../../../tests';
import { PostgresCreateUserRepository } from './create-user';
import { prisma } from '../../../../prisma/prisma';

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository();

        const result = await sut.execute(user);

        expect(result).toEqual(user);
    });

    it('should call prisma with correct params', async () => {
        const sut = new PostgresCreateUserRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'create');

        await sut.execute(user);

        expect(prismaSpy).toHaveBeenCalledWith({ data: user });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresCreateUserRepository();

        jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error());

        const promisse = sut.execute(user);

        await expect(promisse).rejects.toThrow();
    });
});
