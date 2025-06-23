import {
    ForbiddenError,
    TransactionNotFoundError,
} from '../../errors/index.js';

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getTransactionByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository;
        this.getTransactionByIdRepository = getTransactionByIdRepository;
    }
    async execute(transactionId, userId, updateTransactionParams) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId);

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId);
        }

        if (transaction.userId !== userId) {
            throw new ForbiddenError();
        }

        return await this.updateTransactionRepository.execute(
            transactionId,
            updateTransactionParams,
        );
    }
}
