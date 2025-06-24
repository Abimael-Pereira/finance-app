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

    const queryParams = {
        userId: faker.string.uuid(),
        from: '2025-01-01',
        to: '2025-12-31',
    };

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { getTransactionsByUserIdController } = makeSut();

        const result = await getTransactionsByUserIdController.execute({
            query: queryParams,
        });

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual([body]);
    });

    it('should return 400 when the zod parsing schema throws ZodError', async () => {
        const { getTransactionsByUserIdController } = makeSut();

        const invalidQueryParams = {
            userId: 'invalid-uuid',
            from: 'invalid-date',
            to: 'invalid-date',
        };

        const result = await getTransactionsByUserIdController.execute({
            query: invalidQueryParams,
        });

        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual('User ID must be a valid UUID');
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
            query: queryParams,
        });

        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual({
            message: 'User not found',
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
            query: queryParams,
        });

        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual({
            message: 'Internal server error',
        });
    });

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut();

        const executeSpy = jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        );

        await getTransactionsByUserIdController.execute({
            query: queryParams,
        });

        expect(executeSpy).toHaveBeenCalledWith(queryParams.userId);
    });
});
