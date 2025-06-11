import { DeleteTransactionUseCase } from './delete-transaction';
import { transaction } from '../../tests/index.js';

describe('DeleteTransactionUseCase', () => {
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
