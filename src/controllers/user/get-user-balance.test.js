import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';
import { UserNotFoundError } from '../../errors/user';

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
    };

    it('Should return 200 when getting user balance', async () => {
        const { getUserBalanceController } = makeSut();

        const result = await getUserBalanceController.execute(httpRequest);

        expect(result.statusCode).toBe(200);
    });

    it('Should return 400 when userId is invalid', async () => {
        const { getUserBalanceController } = makeSut();

        const result = await getUserBalanceController.execute({
            params: { userId: 'invalid_id' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('Should return 500 if GetUserBalanceUseCase throws', async () => {
        const { getUserBalanceController, getUserBalanceUseCase } = makeSut();

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValue(
            new Error(),
        );

        const result = await getUserBalanceController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it('Should return 404 if GetUserBalanceUseCase throws an UserNotFound error', async () => {
        const { getUserBalanceController, getUserBalanceUseCase } = makeSut();

        jest.spyOn(getUserBalanceUseCase, 'execute').mockImplementation(() => {
            throw new UserNotFoundError();
        });

        const result = await getUserBalanceController.execute(httpRequest);

        expect(result.statusCode).toBe(404);
    });

    it('should call GetUserBalanceUseCase with correct params', async () => {
        const { getUserBalanceController, getUserBalanceUseCase } = makeSut();
        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute');

        await getUserBalanceController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
    });
});
