import { CreateUserController } from './create-user';
import { EmailAlreadyInUseError } from '../../errors/user';
import { ZodError } from 'zod';
import { createOrUpdateUserParams } from '../../tests/';

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute(user) {
            return user;
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        return { createUserUseCase, createUserController };
    };

    const httpRequest = {
        body: createOrUpdateUserParams,
    };

    it('should return 201 when creating an user successfully', async () => {
        // Arrange
        const { createUserController } = makeSut();

        // act

        const result = await createUserController.execute(httpRequest);

        // assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(httpRequest.body);
    });

    it('should return 400 if first_name is not provided', async () => {
        const { createUserController } = makeSut();

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if last_name is not provided', async () => {
        const { createUserController } = makeSut();

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
        const { createUserController } = makeSut();

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        const { createUserController } = makeSut();

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email provided is invalid', async () => {
        const { createUserController } = makeSut();

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                email: 'invalidEmail',
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password provided is invalid', async () => {
        const { createUserController } = makeSut();

        const result = await createUserController.execute({
            body: {
                ...httpRequest.body,
                password: '123',
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should call CreateUserUseCase with correct params', async () => {
        const { createUserController, createUserUseCase } = makeSut();

        const executeSpy = jest.spyOn(createUserUseCase, 'execute');

        await createUserController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 500 if CreateUserUseCase throws', async () => {
        const { createUserController, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValue(new Error());

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it('should return 400 if CreateUserUseCase throws an EmailAlreadyInUseError', async () => {
        const { createUserController, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValue(
            new EmailAlreadyInUseError(),
        );

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if CreateUserUseCase throws a ZodError', async () => {
        const { createUserController, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValue(
            new ZodError([
                {
                    code: 'custom',
                    message: 'Campo inválido',
                    path: ['first_name'],
                },
            ]),
        );

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });
});
