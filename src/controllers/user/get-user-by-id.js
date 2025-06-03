import {
    ok,
    serverError,
    invalidIdResponse,
    userNotFoundResponse,
    checkIfIdIsValid,
} from '../helpers/index.js';

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase;
    }
    async execute(httpRequest) {
        try {
            const isIdValid = checkIfIdIsValid(httpRequest.params.userid);
            if (!isIdValid) {
                return invalidIdResponse();
            }

            const user = await this.getUserByIdUseCase.execute(
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
