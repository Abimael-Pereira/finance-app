import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from './delete-user';

describe('DeleteUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
    };

    class DeleteUserRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId };
        }
    }

    const makeSut = () => {
        const deleteUserRepositoryStub = new DeleteUserRepositoryStub();
        const deleteUserUseCase = new DeleteUserUseCase(
            deleteUserRepositoryStub,
        );
        return { deleteUserUseCase, deleteUserRepositoryStub };
    };
    it('sould delete a user successfully', async () => {
        const { deleteUserUseCase } = makeSut();

        const result = await deleteUserUseCase.execute(user.id);

        expect(result).toBeTruthy();
        expect(result).toEqual(user);
    });
});
