import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/user';
import { transaction, user } from '../../tests/index.js';

describe('GetTransactionsByUserId', () => {
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

        const result = await getTransactionsByUserIdUseCase.execute(
            transaction.userId,
        );

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
