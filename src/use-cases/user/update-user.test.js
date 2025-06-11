import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';
import { EmailAlreadyInUseError } from '../../errors/user';
import { user } from '../../tests/index.js';

describe('UpdateUserUseCase', () => {
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

    const updatedUser = {
        id: user.id,
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
    };

    it('should update user successfully (without email)', async () => {
        const { updateUserUseCase } = makeSut();

        const result = await updateUserUseCase.execute(
            updatedUser.id,
            updatedUser,
        );

        expect(result).toEqual({
            ...user,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            password: `hashed_${updatedUser.password}`,
        });
    });

    it('should update user successfully (with email)', async () => {
        const { updateUserUseCase } = makeSut();

        const result = await updateUserUseCase.execute(user.id, updatedUser);

        expect(result).toEqual({
            ...updatedUser,
            password: `hashed_${updatedUser.password}`,
        });
    });

    it('should throws an EmailAlreadyInUseError if email already in use', async () => {
        const { updateUserUseCase, getUserByEmailRepository } = makeSut();

        const getUserByEmailReturned = {
            id: faker.string.uuid(),
            email: updatedUser.email,
        };

        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            getUserByEmailReturned,
        );

        const result = updateUserUseCase.execute(user.id, updatedUser);

        await expect(result).rejects.toThrow(
            new EmailAlreadyInUseError(updatedUser.email),
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
