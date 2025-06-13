import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { user as fakeUser } from '../../../tests';
import { PostgresUpdateUserRepository } from './update-user';

describe('UpdateUserRepository', () => {
    const updateUserParams = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    it('should update a user on db', async () => {
        await prisma.user.create({ data: fakeUser });

        const sut = new PostgresUpdateUserRepository();

        const result = await sut.execute(fakeUser.id, updateUserParams);

        expect(result).toStrictEqual({ ...fakeUser, ...updateUserParams });
    });

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: fakeUser });

        const sut = new PostgresUpdateUserRepository();

        const prismaSpy = jest.spyOn(prisma.user, 'update');

        await sut.execute(fakeUser.id, updateUserParams);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
            data: updateUserParams,
        });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository();

        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error());

        const promisse = sut.execute(fakeUser.id, updateUserParams);

        await expect(promisse).rejects.toThrow();
    });
});
