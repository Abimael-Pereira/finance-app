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
        expect(result.body).toEqual(httpRequest.body);
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

    it('should return 400 if last_name is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Pereira',
                email: 'abimael@gmail.com',
                password: 'asdqwse123',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Abimael',
                last_name: 'Pereira',
                password: 'asdqwse123',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Abimael',
                last_name: 'Pereira',
                email: 'abimael@gmail.com',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email provided is invalid', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Abimael',
                last_name: 'Pereira',
                email: 'abimael.com',
                password: 'asdqwse123',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password provided is invalid', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Abimael',
                last_name: 'Pereira',
                email: 'abimael@gmail.com',
                password: 'teste',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should call CreateUserUseCase with correct params', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Abimael',
                last_name: 'Pereira',
                email: 'abimael@gmail.com',
                password: 'teste12345',
            },
        };

        const executeSpy = jest.spyOn(createUserUseCase, 'execute');

        await createUserController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
        expect(executeSpy).toHaveBeenCalledTimes(1);
    });
});
