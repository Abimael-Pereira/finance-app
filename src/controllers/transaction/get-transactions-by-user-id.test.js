import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/user';
import { transaction } from '../../tests';

describe('GetTransactionsByUserIdController', () => {
    const body = {
        transaction,
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

    it('should return 500 when GetUserByIdUseCase throws generic error', async () => {
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut();

        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error());

        const result = await getTransactionsByUserIdController.execute({
            query: { userId: faker.string.uuid() },
        });

        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual({
            message: 'Internal server error',
        });
    });

    it('should call GetTransactionsByUserIdUseCase with correct userId', async () => {
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut();

        const userId = faker.string.uuid();
        const executeSpy = jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        );

        await getTransactionsByUserIdController.execute({
            query: { userId },
        });

        expect(executeSpy).toHaveBeenCalledWith(userId);
    });
});
