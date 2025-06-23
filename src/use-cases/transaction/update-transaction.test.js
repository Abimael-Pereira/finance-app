import { UpdateTransactionUseCase } from './update-transaction';
import { transaction } from '../../tests/index.js';

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute(transactionId, updateTransactionParams) {
            return { ...updateTransactionParams, id: transactionId };
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId };
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub();
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub();
        const updateTransactionUseCase = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionByIdRepository,
        );

        return { updateTransactionRepository, updateTransactionUseCase };
    };

    it('should update a transaction successfully', async () => {
        const { updateTransactionUseCase } = makeSut();

        const result = await updateTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
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

        await updateTransactionUseCase.execute(
            transaction.id,
            transaction.userId,
            transaction,
        );

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
