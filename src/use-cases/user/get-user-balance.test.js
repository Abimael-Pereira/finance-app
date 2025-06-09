import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';

describe('GetUserBalance', () => {
    const userBalance = {
        earnings: '1000',
        expenses: '500',
        invesments: '200',
        balance: '300',
    };

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                email: faker.internet.email(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                password: faker.internet.password(),
            };
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const getUserBalanceController = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        );

        return {
            getUserBalanceController,
            getUserBalanceRepository,
            getUserByIdRepository,
        };
    };

    it('should return the user balance', async () => {
        const { getUserBalanceController } = makeSut();

        const result = await getUserBalanceController.execute(
            faker.string.uuid(),
        );

        expect(result).toEqual(userBalance);
    });
});
