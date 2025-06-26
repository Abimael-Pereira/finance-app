import {
    ForbiddenError,
    TransactionNotFoundError,
} from '../../errors/index.js';

export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository, getTransactionByIdRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository;
        this.getTransactionByIdRepository = getTransactionByIdRepository;
    }
    async execute(transactionId, userId) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId);

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId);
        }

        if (transaction.userId !== userId) {
            throw new ForbiddenError();
        }

        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId);

        return deletedTransaction;
    }
}
