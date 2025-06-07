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

    it('should return 400 when unallowed field is provided', async () => {
        const { updateTransactionController } = makeSut();

        const result = await updateTransactionController.execute({
            params: { ...httpRequest.params },
            body: { ...httpRequest.body, unallowed: 'unallowed_field' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when amount is invalid', async () => {
        const { updateTransactionController } = makeSut();

        const result = await updateTransactionController.execute({
            params: { ...httpRequest.params },
            body: { ...httpRequest.body, amount: -325.42 },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when type is invalid', async () => {
        const { updateTransactionController } = makeSut();

        const result = await updateTransactionController.execute({
            params: { ...httpRequest.params },
            body: { ...httpRequest.body, type: 'invalid_type' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when date is invalid', async () => {
        const { updateTransactionController } = makeSut();

        const result = await updateTransactionController.execute({
            params: { ...httpRequest.params },
            body: { ...httpRequest.body, date: 'invalid_date' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 500 when use case throws a generic error', async () => {
        const { updateTransactionController, updateTransactionUseCase } =
            makeSut();

        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const result = await updateTransactionController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual({ message: 'Internal server error' });
    });

    it('should call UpdateTransactionUseCase with correct params', async () => {
        const { updateTransactionController, updateTransactionUseCase } =
            makeSut();

        const useCase = jest.spyOn(updateTransactionUseCase, 'execute');

        await updateTransactionController.execute(httpRequest);

        expect(useCase).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        );
    });
});
