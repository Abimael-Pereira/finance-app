import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user';

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute() {
            return {
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

    it('should return 400 if an invalid userid is provided', async () => {
        const { updateUserController } = makeSut();

        const result = await updateUserController.execute({
            params: { userid: 'invalid_id' },
        });

        expect(result.statusCode).toBe(400);
    });
});
