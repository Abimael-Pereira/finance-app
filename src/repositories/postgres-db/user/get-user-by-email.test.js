import { user as fakerUser } from '../../../tests';
import { prisma } from '../../../../prisma/prisma';
import { PostgresGetUserByEmailRepository } from './get-user-by-email';

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        await prisma.user.create({ data: fakerUser });

        const sut = new PostgresGetUserByEmailRepository();

        const result = await sut.execute(fakerUser.email);

        expect(result).toStrictEqual(fakerUser);
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

        await sut.execute(fakerUser.email);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: fakerUser.email,
            },
        });
    });
});
