import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { user as fakerUser } from '../../../tests';
import { PostgresUpdateUserRepository } from './update-user';

describe('UpdateUserRepository', () => {
    it('should update a user on db', async () => {
        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        await prisma.user.create({ data: fakerUser });

        const sut = new PostgresUpdateUserRepository();

        const result = await sut.execute(fakerUser.id, updateUserParams);

        expect(result).toStrictEqual({ ...fakerUser, ...updateUserParams });
    });
});
