import { faker } from '@faker-js/faker';
import { CreateTrasactionUseCase } from './create-transaction';

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
});
