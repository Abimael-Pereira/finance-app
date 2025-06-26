import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int();
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
        const getUserBalanceController = new GetUserBalanceController(
            getUserBalanceUseCase,
        );

        return { getUserBalanceController, getUserBalanceUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        query: {
            from: '2025-01-01',
            to: '2025-12-31',
        },
    };

    it('Should return 200 when getting user balance', async () => {
        const { getUserBalanceController } = makeSut();

        const result = await getUserBalanceController.execute(httpRequest);

        expect(result.statusCode).toBe(200);
    });

    it('Should return 400 if params or query are invalid', async () => {
        const { getUserBalanceController } = makeSut();
        const invalidHttpRequest = {
            params: {
                userId: 'invalid-uuid',
            },
            query: {
                from: 'invalid-date',
                to: 'invalid-date',
            },
        };
        const result =
            await getUserBalanceController.execute(invalidHttpRequest);
        expect(result.statusCode).toBe(400);
        expect(result.body.message).toBe('User ID must be a valid UUID.');
    });

    it('Should return 500 if GetUserBalanceUseCase throws', async () => {
        const { getUserBalanceController, getUserBalanceUseCase } = makeSut();

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValue(
            new Error(),
        );

        const result = await getUserBalanceController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it('should call GetUserBalanceUseCase with correct params', async () => {
        const { getUserBalanceController, getUserBalanceUseCase } = makeSut();
        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute');

        await getUserBalanceController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.query.from,
            httpRequest.query.to,
        );
    });
});
