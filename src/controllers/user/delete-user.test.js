import { faker } from '@faker-js/faker';
import { DeleteUserController } from './delete-user';
import { user } from '../../tests';

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub();
        const deleteUserController = new DeleteUserController(
            deleteUserUseCase,
        );

        return { deleteUserController, deleteUserUseCase };
    };

    const httpRequest = {
        params: {
            userid: faker.string.uuid(),
        },
    };

    it('Should return 200 if user is deleted', async () => {
        const { deleteUserController } = makeSut();

        const result = await deleteUserController.execute(httpRequest);

        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if id is invalid', async () => {
        const { deleteUserController } = makeSut();

        const result = await deleteUserController.execute({
            params: { userid: 'invalid_id' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 404 if user is not found', async () => {
        const { deleteUserController, deleteUserUseCase } = makeSut();

        jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(null);

        const result = await deleteUserController.execute(httpRequest);

        expect(result.statusCode).toBe(404);
    });

    it('should return 500 if DeleteUserCase throws a server error', async () => {
        const { deleteUserController, deleteUserUseCase } = makeSut();

        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValue(new Error());

        const result = await deleteUserController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it('should call DeleteUserUseCase with correct params', async () => {
        const { deleteUserController, deleteUserUseCase } = makeSut();

        const executeSpy = jest.spyOn(deleteUserUseCase, 'execute');

        await deleteUserController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userid);
    });
});
