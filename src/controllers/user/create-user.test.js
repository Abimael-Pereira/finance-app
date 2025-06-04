import { CreateUserController } from './create-user';

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }

    it('should return 201 when creating an user successfully', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Abimael',
                last_name: 'Pereira',
                email: 'abimael@gmail.com',
                password: 'asdqwse123',
            },
        };

        // act

        const result = await createUserController.execute(httpRequest);

        // assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toBeTruthy();
        expect(result.body).toBe(httpRequest.body);
    });

    it('should return 400 if first_name is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                last_name: 'Pereira',
                email: 'abimael@gmail.com',
                password: 'asdqwse123',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });
});
