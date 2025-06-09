import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';
import { UserNotFoundError } from '../../errors/user';

describe('GetUserBalance', () => {
    const userBalance = {
        earnings: '1000',
        expenses: '500',
        invesments: '200',
        balance: '300',
    };

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                email: faker.internet.email(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password(),
            };
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const getUserBalanceController = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        );

        return {
            getUserBalanceController,
            getUserBalanceRepository,
            getUserByIdRepository,
        };
    };

    it('should return the user balance', async () => {
        const { getUserBalanceController } = makeSut();

        const result = await getUserBalanceController.execute(
            faker.string.uuid(),
        );

        expect(result).toEqual(userBalance);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { getUserBalanceController, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        const userId = faker.string.uuid();

        const promisse = getUserBalanceController.execute(userId);

        await expect(promisse).rejects.toThrow(new UserNotFoundError(userId));
    });

    it('should call GetUserByIdRepository with correct param', async () => {
        const { getUserBalanceController, getUserByIdRepository } = makeSut();

        const getUserByIdSpyOn = jest.spyOn(getUserByIdRepository, 'execute');

        const userId = faker.string.uuid();

        await getUserBalanceController.execute(userId);

        expect(getUserByIdSpyOn).toHaveBeenCalledWith(userId);
    });

    it('should call GetUserBalanceRepository with correct param', async () => {
        const { getUserBalanceController, getUserBalanceRepository } =
            makeSut();

        const getUserBalanceSpyOn = jest.spyOn(
            getUserBalanceRepository,
            'execute',
        );

        const userId = faker.string.uuid();

        await getUserBalanceController.execute(userId);

        expect(getUserBalanceSpyOn).toHaveBeenCalledWith(userId);
    });

    it('should throw error if GetUserBalanceRepository throws', async () => {
        const { getUserBalanceController, getUserBalanceRepository } =
            makeSut();

        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const userId = faker.string.uuid();

        const result = getUserBalanceController.execute(userId);

        await expect(result).rejects.toThrow(Error);
    });

    it('should throw error if GetUserByIdRepository throws', async () => {
        const { getUserBalanceController, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const userId = faker.string.uuid();

        const result = getUserBalanceController.execute(userId);

        await expect(result).rejects.toThrow(Error);
    });
});
