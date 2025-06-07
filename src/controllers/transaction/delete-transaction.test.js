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

    it('should return 400 when transaction id is invalid', async () => {
        const { deleteTransactionControler } = makeSut();

        const result = await deleteTransactionControler.execute({
            ...httpRequest,
            params: {
                transactionId: 'invalid_id',
            },
        });

        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual({
            message: 'The provided id is not valid.',
        });
    });

    it('should return 404 when transaction is not found', async () => {
        const { deleteTransactionControler, deleteTransactionUseCase } =
            makeSut();

        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        );

        const result = await deleteTransactionControler.execute(httpRequest);

        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual({
            message: 'Transaction not found.',
        });
    });

    it('should return 500 when DeleteTransactionUseCase throws a ServerError', async () => {
        const { deleteTransactionControler, deleteTransactionUseCase } =
            makeSut();

        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const result = await deleteTransactionControler.execute(httpRequest);

        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual({
            message: 'Internal server error',
        });
    });

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { deleteTransactionControler, deleteTransactionUseCase } =
            makeSut();

        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute');

        await deleteTransactionControler.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
        );
    });
});
