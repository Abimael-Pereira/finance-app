import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js';
import {
    ok,
    serverError,
    checkIfPasswordIsValid,
    invalidIdResponse,
    userNotFoundResponse,
} from './helpers/index.js';

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = checkIfPasswordIsValid(httpRequest.params.userid);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const getUserByIdUseCase = new GetUserByIdUseCase();
            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userid,
            );

            if (!user) {
                return userNotFoundResponse();
            }

            return ok(user);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
