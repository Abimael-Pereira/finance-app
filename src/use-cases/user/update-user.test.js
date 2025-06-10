import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
    };

    class PostgresGetUserByEmailRepositoryStub {
        async execute({ email }) {
            return {
                ...user,
                email,
            };
        }
    }

    class PostgresUpdateUserRepositoryStub {
        async execute(userId, updateUserParams) {
            const updateUser = {
                ...user,
                ...updateUserParams,
                id: userId,
            };
            return updateUser;
        }
    }

    class PasswordHasherAdapterStub {
        async execute(password) {
            return `hashed_${password}`;
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository =
            new PostgresGetUserByEmailRepositoryStub();
        const updateUserRepository = new PostgresUpdateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();

        const updateUserUseCase = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        );

        return {
            updateUserUseCase,
            updateUserRepository,
            getUserByEmailRepository,
        };
    };

    it('should update user successfully (without email)', async () => {
        const { updateUserUseCase } = makeSut();

        const updateUser = {
            id: user.id,
            email: user.email,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            password: faker.internet.password(),
        };

        const result = await updateUserUseCase.execute(
            updateUser.id,
            updateUser,
        );

        expect(result).toEqual({
            ...user,
            first_name: updateUser.first_name,
            last_name: updateUser.last_name,
            password: `hashed_${updateUser.password}`,
        });
    });
});
