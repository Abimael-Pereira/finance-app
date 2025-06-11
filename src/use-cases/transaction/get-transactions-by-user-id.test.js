import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/user';

describe('GetTransactionsByUserId', () => {
    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const transaction = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(types),
        amount: Number(faker.finance.amount()),
    };

    const user = {
        id: transaction.userId,
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
    };

    class GetTransactionsByUserIdRepositoryStub {
        async execute(userId) {
            const transactioWithId = { ...transaction, userId };
            return [transactioWithId];
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId };
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCase(
                getTransactionsByUserIdRepository,
                getUserByIdRepository,
            );

        return {
            getTransactionsByUserIdUseCase,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        };
    };

    it('should get an array of transactions by id successfully', async () => {
        const { getTransactionsByUserIdUseCase } = makeSut();

        const result = await getTransactionsByUserIdUseCase.execute(user.id);

        expect(result).toEqual([transaction]);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { getTransactionsByUserIdUseCase, getUserByIdRepository } =
            makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        const result = getTransactionsByUserIdUseCase.execute(user.id);

        await expect(result).rejects.toThrow(new UserNotFoundError(user.id));
    });

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        const {
            getTransactionsByUserIdUseCase,
            getTransactionsByUserIdRepository,
        } = makeSut();

        const getTransactionSpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        );

        await getTransactionsByUserIdUseCase.execute(user.id);

        expect(getTransactionSpy).toHaveBeenCalledWith(user.id);
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        const { getTransactionsByUserIdUseCase, getUserByIdRepository } =
            makeSut();

        const getTransactionSpy = jest.spyOn(getUserByIdRepository, 'execute');

        await getTransactionsByUserIdUseCase.execute(user.id);

        expect(getTransactionSpy).toHaveBeenCalledWith(user.id);
    });

    it('should throw if GetTransactionsByUserIdRepository throw a generic error', async () => {
        const {
            getTransactionsByUserIdUseCase,
            getTransactionsByUserIdRepository,
        } = makeSut();

        jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        const result = getTransactionsByUserIdUseCase.execute(user.id);

        await expect(result).rejects.toThrow();
    });

    it('should throw if GetUserByIdRepository throw a generic error', async () => {
        const { getTransactionsByUserIdUseCase, getUserByIdRepository } =
            makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const result = getTransactionsByUserIdUseCase.execute(user.id);

        await expect(result).rejects.toThrow();
    });
});
