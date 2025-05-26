import { notFound, ok, serverError } from './helpers/http.js';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js';
import { checkIfPasswordIsValid, invalidIdResponse } from './helpers/user.js';

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
                return notFound({ message: 'User not found' });
            }

            return ok(user);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
