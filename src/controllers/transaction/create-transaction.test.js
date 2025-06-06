import { faker } from '@faker-js/faker';
import { CreateTransactionController } from './create-transaction';

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(params) {
            return {
                ...params,
                id: faker.string.uuid(),
            };
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub();
        const createTransactionController = new CreateTransactionController(
            createTransactionUseCase,
        );

        return { createTransactionController, createTransactionUseCase };
    };

    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const httpRequest = {
        body: {
            userId: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.recent().toISOString(),
            type: faker.helpers.arrayElement(types),
            amount: Number(faker.finance.amount()),
        },
    };

    it('should return 201 when creating transaction successfully', async () => {
        const { createTransactionController } = makeSut();

        const result = await createTransactionController.execute(httpRequest);

        expect(result.statusCode).toBe(201);
    });

    it('should return 400 when missing user_id', async () => {
        const { createTransactionController } = makeSut();

        const result = await createTransactionController.execute({
            body: {
                ...httpRequest.body,
                userId: undefined,
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when missing name', async () => {
        const { createTransactionController } = makeSut();

        const result = await createTransactionController.execute({
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        });

        expect(result.statusCode).toBe(400);
    });
});
