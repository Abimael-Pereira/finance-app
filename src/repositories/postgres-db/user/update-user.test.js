import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser } from '../../../tests';
import { PostgresUpdateUserRepository } from './update-user';

describe('UpdateUserRepository', () => {
    const updateUserParams = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    it('should update a user on db', async () => {
        await prisma.user.create({ data: fakerUser });

        const sut = new PostgresUpdateUserRepository();

        const result = await sut.execute(fakerUser.id, updateUserParams);

        expect(result).toStrictEqual({ ...fakerUser, ...updateUserParams });
    });

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: fakerUser });

        const sut = new PostgresUpdateUserRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'update');

        await sut.execute(fakerUser.id, updateUserParams);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakerUser.id,
            },
            data: updateUserParams,
        });
    });
});
