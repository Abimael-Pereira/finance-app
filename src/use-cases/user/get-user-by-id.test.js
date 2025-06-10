import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from './get-user-by-id';

describe('GetUserById', () => {
    const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
    };

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const getUserByIdUseCase = new GetUserByIdUseCase(
            getUserByIdRepository,
        );

        return { getUserByIdUseCase, getUserByIdRepository };
    };

    it('should get a user by id successfully', async () => {
        const { getUserByIdUseCase } = makeSut();

        const result = await getUserByIdUseCase.execute(user.id);

        expect(result).toBeTruthy();
        expect(result).toEqual(user);
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        const { getUserByIdRepository, getUserByIdUseCase } = makeSut();

        const repositorySpy = jest.spyOn(getUserByIdRepository, 'execute');

        await getUserByIdUseCase.execute(user.id);

        expect(repositorySpy).toHaveBeenCalledWith(user.id);
    });
});
