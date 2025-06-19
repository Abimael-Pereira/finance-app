import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user';
import { ZodError } from 'zod';
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user';
import { createOrUpdateUserParams } from '../../tests';

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user;
        }
    }
    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub();
        const updateUserController = new UpdateUserController(
            updateUserUseCase,
        );

        return { updateUserController, updateUserUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: createOrUpdateUserParams,
    };

    it('should return 200 when updating a user', async () => {
        const { updateUserController } = makeSut();

        const result = await updateUserController.execute(httpRequest);

        expect(result.statusCode).toBe(200);
    });

    it('should return 400 when an invalid email is provided', async () => {
        const { updateUserController } = makeSut();

        const result = await updateUserController.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, email: 'invalidEmail' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when a invalid password is provided', async () => {
        const { updateUserController } = makeSut();

        const result = await updateUserController.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if an invalid userid is provided', async () => {
        const { updateUserController } = makeSut();

        const result = await updateUserController.execute({
            params: { userId: 'invalid_id' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if an unallowed field is provided', async () => {
        const { updateUserController } = makeSut();

        const result = await updateUserController.execute({
            params: httpRequest.params,
            body: { ...httpRequest.body, unallowed_field: 'unallowed_field' },
        });

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if a ZodError is throws', async () => {
        const { updateUserController, updateUserUseCase } = makeSut();

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(
            new ZodError([
                {
                    code: 'custom',
                    message: 'Campo inválido',
                    path: ['first_name'],
                },
            ]),
        );

        const result = await updateUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if an EmailAlreadyInUseError is throws', async () => {
        const { updateUserController, updateUserUseCase } = makeSut();

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(
            new EmailAlreadyInUseError(),
        );

        const result = await updateUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 500 if a ServerError is throws', async () => {
        const { updateUserController, updateUserUseCase } = makeSut();

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(new Error());

        const result = await updateUserController.execute(httpRequest);

        expect(result.statusCode).toBe(500);
    });

    it('should call updateUserUseCase with correct values', async () => {
        const { updateUserController, updateUserUseCase } = makeSut();
        const executeSpy = jest.spyOn(updateUserUseCase, 'execute');

        await updateUserController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        );
    });

    it('should throw UserNotFoundError if user is not found', async () => {
        const { updateUserController, updateUserUseCase } = makeSut();

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(
            new UserNotFoundError(faker.string.uuid()),
        );

        const result = await updateUserController.execute(httpRequest);

        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual({
            message: 'User not found.',
        });
    });
});
