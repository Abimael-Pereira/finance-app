import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
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
});
