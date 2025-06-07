import { faker } from '@faker-js/faker';
import { UpdateTransactionController } from './update-transaction';

describe('UpdateTransactionController', () => {
    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            userId: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: faker.helpers.arrayElement(types),
            amount: Number(faker.finance.amount()),
        },
    };

    class UpdataTransactionUseCaseStub {
        async execute() {
            return httpRequest.body;
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdataTransactionUseCaseStub();
        const updateTransactionController = new UpdateTransactionController(
            updateTransactionUseCase,
        );

        return { updateTransactionController, updateTransactionUseCase };
    };

    it('should return 200 when updating a transaction successfully', async () => {
        const { updateTransactionController } = makeSut();

        const result = await updateTransactionController.execute(httpRequest);

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(httpRequest.body);
    });
});
