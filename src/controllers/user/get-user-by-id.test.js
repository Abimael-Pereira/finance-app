import { faker } from '@faker-js/faker';
import { GetUserByIdController } from './get-user-by-id';
import { user } from '../../tests';

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub();
        const getUserByIdController = new GetUserByIdController(
            getUserByIdUseCase,
        );

        return { getUserByIdController, getUserByIdUseCase };
    };

    const httpRequest = {
        params: {
            userid: faker.string.uuid(),
        },
    };

    it('should return 200 if an user is found', async () => {
        const { getUserByIdController } = makeSut();

        const result = await getUserByIdController.execute(httpRequest);

        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if userId provided is invalid', async () => {
        const { getUserByIdController } = makeSut();

        const result = await getUserByIdController.execute({
            params: { userid: 'invalid_id' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 404 if user is not found', async () => {
        const { getUserByIdController, getUserByIdUseCase } = makeSut();

        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null);

        const result = await getUserByIdController.execute(httpRequest);

        expect(result.statusCode).toBe(404);
    });

    it('should return 500 if GetUserByIdUseCase throws a serverError', async () => {
        const { getUserByIdController, getUserByIdUseCase } = makeSut();

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValue(
            new Error(),
        );

        const result = await getUserByIdController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { getUserByIdController, getUserByIdUseCase } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute');

        await getUserByIdController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userid);
    });
});
