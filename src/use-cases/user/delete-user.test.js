import { DeleteUserUseCase } from './delete-user';
import { user } from '../../tests/index.js';

describe('DeleteUserUseCase', () => {
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

    it('should throw an error if DeleteUserRepository throws', async () => {
        const { deleteUserUseCase, deleteUserRepositoryStub } = makeSut();

        jest.spyOn(deleteUserRepositoryStub, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const deleteResult = deleteUserUseCase.execute(user.id);

        await expect(deleteResult).rejects.toThrow();
    });
});
