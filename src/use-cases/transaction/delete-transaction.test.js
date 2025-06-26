import { DeleteTransactionUseCase } from './delete-transaction';
import { transaction } from '../../tests/index.js';
import { ForbiddenError } from '../../errors/user.js';

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId };
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId };
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub();
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub();
        const deleteTransactionUseCase = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        );

        return {
            deleteTransactionUseCase,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        };
    };

    it('should delete transaction successfully', async () => {
        const { deleteTransactionUseCase } = makeSut();

        const result = await deleteTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
        );

        expect(result).toEqual(transaction);
    });

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { deleteTransactionUseCase, deleteTransactionRepository } =
            makeSut();

        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        );

        await deleteTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
        );

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
        );
    });

    it('should call GetTransactionByIdRepository with correct params', async () => {
        const { deleteTransactionUseCase, getTransactionByIdRepository } =
            makeSut();

        const getTransactionByIdRepositorySpy = jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        );

        await deleteTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
        );

        expect(getTransactionByIdRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
        );
    });

    it('should throw if GetTransactionByIdRepository throws', async () => {
        const { deleteTransactionUseCase, getTransactionByIdRepository } =
            makeSut();

        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        const result = deleteTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
        );

        await expect(result).rejects.toThrow();
    });

    it('should throw if DeleteTransactionRepository throw generic error', async () => {
        const { deleteTransactionUseCase, deleteTransactionRepository } =
            makeSut();

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        const result = deleteTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
        );

        await expect(result).rejects.toThrow();
    });

    it('should throw ForbiddenError if transaction does not belong to user', async () => {
        const { deleteTransactionUseCase, getTransactionByIdRepository } =
            makeSut();

        jest.spyOn(
            getTransactionByIdRepository,
            'execute',
        ).mockResolvedValueOnce({ ...transaction, userId: 'another-user-id' });

        const result = deleteTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
        );

        await expect(result).rejects.toThrow(new ForbiddenError());
    });
});
