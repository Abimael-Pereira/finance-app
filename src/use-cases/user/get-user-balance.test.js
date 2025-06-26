import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';
import { UserNotFoundError } from '../../errors/user';
import { user, userBalance } from '../../tests/index.js';

describe('GetUserBalance', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const getUserBalanceUseCase = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        );

        return {
            getUserBalanceUseCase,
            getUserBalanceRepository,
            getUserByIdRepository,
        };
    };

    const from = '2025-01-01';
    const to = '2025-12-31';

    it('should return the user balance', async () => {
        const { getUserBalanceUseCase } = makeSut();

        const result = await getUserBalanceUseCase.execute(
            faker.string.uuid(),
            from,
            to,
        );

        expect(result).toEqual(userBalance);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { getUserBalanceUseCase, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        const userId = faker.string.uuid();

        const promisse = getUserBalanceUseCase.execute(userId, from, to);

        await expect(promisse).rejects.toThrow(new UserNotFoundError(userId));
    });

    it('should call GetUserByIdRepository with correct param', async () => {
        const { getUserBalanceUseCase, getUserByIdRepository } = makeSut();

        const getUserByIdSpyOn = jest.spyOn(getUserByIdRepository, 'execute');

        const userId = faker.string.uuid();

        await getUserBalanceUseCase.execute(userId, from, to);

        expect(getUserByIdSpyOn).toHaveBeenCalledWith(userId);
    });

    it('should call GetUserBalanceRepository with correct param', async () => {
        const { getUserBalanceUseCase, getUserBalanceRepository } = makeSut();

        const getUserBalanceSpyOn = jest.spyOn(
            getUserBalanceRepository,
            'execute',
        );

        const userId = faker.string.uuid();

        await getUserBalanceUseCase.execute(userId, from, to);

        expect(getUserBalanceSpyOn).toHaveBeenCalledWith(userId, from, to);
    });

    it('should throw error if GetUserBalanceRepository throws', async () => {
        const { getUserBalanceUseCase, getUserBalanceRepository } = makeSut();

        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const userId = faker.string.uuid();

        const result = getUserBalanceUseCase.execute(userId, from, to);

        await expect(result).rejects.toThrow();
    });

    it('should throw error if GetUserByIdRepository throws', async () => {
        const { getUserBalanceUseCase, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const userId = faker.string.uuid();

        const result = getUserBalanceUseCase.execute(userId, from, to);

        await expect(result).rejects.toThrow();
    });
});
