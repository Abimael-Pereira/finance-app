import { faker } from '@faker-js/faker';
import { UpdateTransactionUseCase } from './update-transaction';

describe('UpdateTransactionUseCase', () => {
    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const transaction = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(types),
        amount: Number(faker.finance.amount()),
    };

    class UpdateTransactionRepositoryStub {
        async execute(transactionId, updateTransactionParams) {
            return { ...updateTransactionParams, id: transactionId };
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub();
        const updateTransactionUseCase = new UpdateTransactionUseCase(
            updateTransactionRepository,
        );

        return { updateTransactionRepository, updateTransactionUseCase };
    };

    it('should update a transaction successfully', async () => {
        const { updateTransactionUseCase } = makeSut();

        const result = await updateTransactionUseCase.execute(
            transaction.id,
            transaction,
        );

        expect(result).toEqual(transaction);
    });

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { updateTransactionUseCase, updateTransactionRepository } =
            makeSut();

        const updateTransactionSpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        );

        await updateTransactionUseCase.execute(transaction.id, transaction);

        expect(updateTransactionSpy).toHaveBeenCalledWith(
            transaction.id,
            transaction,
        );
    });

    it('should throw if UpdateTransactionRepository throws', async () => {
        const { updateTransactionUseCase, updateTransactionRepository } =
            makeSut();

        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        const result = updateTransactionUseCase.execute(
            transaction.id,
            transaction,
        );

        await expect(result).rejects.toThrow();
    });
});
