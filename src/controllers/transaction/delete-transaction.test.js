import { faker } from '@faker-js/faker';
import { DeleteTransactionController } from './delete-transaction';

describe('DeleteTransaction', () => {
    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            id: faker.string.uuid(),
            userId: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: faker.helpers.arrayElement(types),
            amount: Number(faker.finance.amount()),
        },
    };

    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                ...httpRequest.body,
            };
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
        const deleteTransactionControler = new DeleteTransactionController(
            deleteTransactionUseCase,
        );

        return { deleteTransactionControler, deleteTransactionUseCase };
    };

    it('should return 200 when deleting a transaction successfully', async () => {
        const { deleteTransactionControler } = makeSut();

        const result = await deleteTransactionControler.execute(httpRequest);

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(httpRequest.body);
    });
});
