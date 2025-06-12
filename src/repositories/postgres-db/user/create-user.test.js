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
});
