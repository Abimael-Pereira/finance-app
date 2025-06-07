import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/user';

describe('GetTransactionsByUserIdController', () => {
    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const body = {
        userId: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(types),
        amount: Number(faker.finance.amount()),
    };

    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [body];
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub();
        const getTransactionsByUserIdController =
            new GetTransactionsByUserIdController(
                getTransactionsByUserIdUseCase,
            );

        return {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        };
    };

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { getTransactionsByUserIdController } = makeSut();

        const result = await getTransactionsByUserIdController.execute({
            query: { userId: faker.string.uuid() },
        });

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual([body]);
    });

    it('should return 400 when user id in query is missing', async () => {
        const { getTransactionsByUserIdController } = makeSut();

        const result = await getTransactionsByUserIdController.execute({
            query: { userId: null },
        });

        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual({
            message: 'The field userID is required',
        });
    });

    it('should return 400 when user id is invalid', async () => {
        const { getTransactionsByUserIdController } = makeSut();

        const result = await getTransactionsByUserIdController.execute({
            query: { userId: 'invalid_id' },
        });

        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual({
            message: 'The provided id is not valid.',
        });
    });

    it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut();

        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError());

        const result = await getTransactionsByUserIdController.execute({
            query: { userId: faker.string.uuid() },
        });

        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual({
            message: 'User not found.',
        });
    });
});
