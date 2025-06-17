import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '../../controllers';
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByIdController,
    makeUpdateTransactionController,
} from './transaction';

describe('TransactionControllerFactories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        );
    });

    it('should return a valid GetTransactionsByIdController instance', () => {
        expect(makeGetTransactionsByIdController()).toBeInstanceOf(
            GetTransactionsByUserIdController,
        );
    });

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        );
    });

    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        );
    });
});
