import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from '../helpers';

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase;
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(
                httpRequest.params.transactionId,
            );
            if (!idIsValid) {
                return invalidIdResponse();
            }

            const transaction = this.deleteTransactionUseCase.execute(
                httpRequest.params.transactionId,
            );

            return ok(transaction);
        } catch (error) {
            console.log(error);

            return serverError();
        }
    }
}
