import { DeleteUserUseCase } from '../use-cases/delete-user';
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from './helpers/index.js';

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userid;

            const idIsValid = checkIfIdIsValid(userId);
            if (!idIsValid) {
                return invalidIdResponse();
            }

            const deleteUserUseCase = new DeleteUserUseCase(userId);
            const deletedUser = await deleteUserUseCase.execute(userId);

            return ok(deletedUser);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
