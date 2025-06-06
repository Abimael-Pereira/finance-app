import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user';
import { ZodError } from 'zod';
import { EmailAlreadyInUseError } from '../../errors/user';

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
            userid: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 6,
            }),
        },
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

    it('should return 400 if an invalid userid is provided', async () => {
        const { updateUserController } = makeSut();

        const result = await updateUserController.execute({
            params: { userid: 'invalid_id' },
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
});
