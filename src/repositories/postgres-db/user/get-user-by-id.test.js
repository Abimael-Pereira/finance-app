import { user as fakerUser } from '../../../tests';
import { prisma } from '../../../../prisma/prisma';
import { PostgresGetUserByIdRepository } from './get-user-by-id';

describe('GetUserByIdRepository', () => {
    it('should get a user on db', async () => {
        await prisma.user.create({ data: fakerUser });

        const sut = new PostgresGetUserByIdRepository();

        const result = await sut.execute(fakerUser.id);

        expect(result).toStrictEqual(fakerUser);
    });
});
