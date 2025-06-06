import { faker } from '@faker-js/faker';
import { GetUserByIdController } from './get-user-by-id';

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
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
});
