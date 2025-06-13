import { user as fakeUser } from '../../../tests';
import { prisma } from '../../../../prisma/prisma';
import { PostgresGetUserByIdRepository } from './get-user-by-id';

describe('GetUserByIdRepository', () => {
    it('should get a user on db', async () => {
        await prisma.user.create({ data: fakeUser });

        const sut = new PostgresGetUserByIdRepository();

        const result = await sut.execute(fakeUser.id);

        expect(result).toStrictEqual(fakeUser);
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

        await sut.execute(fakeUser.id);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
        });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByIdRepository();

        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(
            new Error(),
        );

        const promisse = sut.execute(fakeUser.id);

        await expect(promisse).rejects.toThrow();
    });
});
