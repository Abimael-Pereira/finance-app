import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from './delete-transaction';

describe('DeleteTransactionUseCase', () => {
    const types = ['EXPENSE', 'EARNING', 'INVESTMENT'];

    const transaction = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.recent().toISOString(),
        type: faker.helpers.arrayElement(types),
        amount: Number(faker.finance.amount()),
    };

    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId };
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub();
        const deleteTransactionUseCase = new DeleteTransactionUseCase(
            deleteTransactionRepository,
        );

        return { deleteTransactionUseCase, deleteTransactionRepository };
    };

    it('should delete transaction successfully', async () => {
        const { deleteTransactionUseCase } = makeSut();

        const result = await deleteTransactionUseCase.execute(transaction.id);

        expect(result).toEqual(transaction);
    });

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { deleteTransactionUseCase, deleteTransactionRepository } =
            makeSut();

        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        );

        await deleteTransactionUseCase.execute(transaction.id);

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
        );
    });

    it('should throw if DeleteTransactionRepository throw generic error', async () => {
        const { deleteTransactionUseCase, deleteTransactionRepository } =
            makeSut();

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        const result = deleteTransactionUseCase.execute(transaction.id);

        await expect(result).rejects.toThrow();
    });
});
