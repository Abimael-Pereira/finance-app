import { user as fakeUser } from '../../../tests';
import { prisma } from '../../../../prisma/prisma';
import { PostgresGetUserByEmailRepository } from './get-user-by-email';

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        await prisma.user.create({ data: fakeUser });

        const sut = new PostgresGetUserByEmailRepository();

        const result = await sut.execute(fakeUser.email);

        expect(result).toStrictEqual(fakeUser);
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

        await sut.execute(fakeUser.email);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: fakeUser.email,
            },
        });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByEmailRepository();

        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(
            new Error(),
        );

        const promisse = sut.execute(fakeUser.email);

        await expect(promisse).rejects.toThrow();
    });
});
