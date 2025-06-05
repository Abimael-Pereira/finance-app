import { faker } from '@faker-js/faker';
import { DeleteUserController } from './delete-user';

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            };
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

        jest.spyOn(deleteUserUseCase, 'execute').mockReturnValue(null);

        const result = await deleteUserController.execute(httpRequest);

        expect(result.statusCode).toBe(404);
    });
});
