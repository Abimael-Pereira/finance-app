import { CreateTrasactionUseCase } from './create-transaction';
import { UserNotFoundError } from '../../errors/user';
import { transactionWithoutId, user } from '../../tests/index.js';

describe('CreateTransactionUseCase', () => {
    class CreateTransactionRepositoryStub {
        async execute(transactionParams) {
            return transactionParams;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId };
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id';
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const idGeneratorAdapter = new IdGeneratorAdapterStub();

        const createTransactionUseCase = new CreateTrasactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        );

        return {
            createTransactionUseCase,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        };
    };

    it('should create a transaction successfully', async () => {
        const { createTransactionUseCase } = makeSut();

        const result =
            await createTransactionUseCase.execute(transactionWithoutId);

        expect(result).toEqual({ ...transactionWithoutId, id: 'random_id' });
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        const { getUserByIdRepository, createTransactionUseCase } = makeSut();

        const repositorySpy = jest.spyOn(getUserByIdRepository, 'execute');

        await createTransactionUseCase.execute(transactionWithoutId);

        expect(repositorySpy).toHaveBeenCalledWith(transactionWithoutId.userId);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { getUserByIdRepository, createTransactionUseCase } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        const result = createTransactionUseCase.execute(transactionWithoutId);

        await expect(result).rejects.toThrow(
            new UserNotFoundError(transactionWithoutId.userId),
        );
    });

    it('should call CreateTransactionRepository with correct params', async () => {
        const { createTransactionRepository, createTransactionUseCase } =
            makeSut();

        const repositorySpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        );

        await createTransactionUseCase.execute(transactionWithoutId);

        expect(repositorySpy).toHaveBeenCalledWith({
            ...transactionWithoutId,
            id: 'random_id',
        });
    });

    it('should throw if repositories throws generic error', async () => {
        const { getUserByIdRepository, createTransactionUseCase } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const result = createTransactionUseCase.execute(transactionWithoutId);

        await expect(result).rejects.toThrow();
    });
});
