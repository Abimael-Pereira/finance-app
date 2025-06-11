import { faker } from '@faker-js/faker';
import { CreateTrasactionUseCase } from './create-transaction';
import { UserNotFoundError } from '../../errors/user';

describe('CreateTransactionUseCase', () => {
    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const transactionParams = {
        userId: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(types),
        amount: Number(faker.finance.amount()),
    };

    const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
    };

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
            await createTransactionUseCase.execute(transactionParams);

        expect(result).toEqual({ ...transactionParams, id: 'random_id' });
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        const { getUserByIdRepository, createTransactionUseCase } = makeSut();

        const repositorySpy = jest.spyOn(getUserByIdRepository, 'execute');

        await createTransactionUseCase.execute(transactionParams);

        expect(repositorySpy).toHaveBeenCalledWith(transactionParams.userId);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { getUserByIdRepository, createTransactionUseCase } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        const result = createTransactionUseCase.execute(transactionParams);

        await expect(result).rejects.toThrow(
            new UserNotFoundError(transactionParams.userId),
        );
    });

    it('should call CreateTransactionRepository with correct params', async () => {
        const { createTransactionRepository, createTransactionUseCase } =
            makeSut();

        const repositorySpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        );

        await createTransactionUseCase.execute(transactionParams);

        expect(repositorySpy).toHaveBeenCalledWith({
            ...transactionParams,
            id: 'random_id',
        });
    });

    it('should throw if repositories throws generic error', async () => {
        const { getUserByIdRepository, createTransactionUseCase } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const result = createTransactionUseCase.execute(transactionParams);

        await expect(result).rejects.toThrow();
    });
});
