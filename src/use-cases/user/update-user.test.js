import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';
import { EmailAlreadyInUseError } from '../../errors/user';

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
    };

    class PostgresGetUserByEmailRepositoryStub {
        async execute(email) {
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

    it('should update user successfully (with email)', async () => {
        const { updateUserUseCase } = makeSut();

        const updateUser = {
            id: user.id,
            email: faker.internet.email(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            password: faker.internet.password(),
        };

        const result = await updateUserUseCase.execute(user.id, updateUser);

        expect(result).toEqual({
            ...updateUser,
            password: `hashed_${updateUser.password}`,
        });
    });

    it('should throws an EmailAlreadyInUseError if email already in use', async () => {
        const { updateUserUseCase, getUserByEmailRepository } = makeSut();

        const updateUser = {
            id: user.id,
            email: faker.internet.email(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            password: faker.internet.password(),
        };

        const getUserByEmailReturned = {
            id: faker.string.uuid(),
            email: updateUser.email,
        };

        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            getUserByEmailReturned,
        );

        const result = updateUserUseCase.execute(user.id, updateUser);

        await expect(result).rejects.toThrow(
            new EmailAlreadyInUseError(updateUser.email),
        );
    });

    it('should call UpdateUserRepository with correct params', async () => {
        const { updateUserUseCase, updateUserRepository } = makeSut();

        const repositorySpy = jest.spyOn(updateUserRepository, 'execute');

        await updateUserUseCase.execute(user.id, user);

        expect(repositorySpy).toHaveBeenCalledWith(user.id, {
            ...user,
            password: `hashed_${user.password}`,
        });
    });

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { updateUserUseCase, updateUserRepository } = makeSut();

        jest.spyOn(updateUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const result = updateUserUseCase.execute(user.id, user);

        await expect(result).rejects.toThrow();
    });
});
