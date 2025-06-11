import { GetUserByIdUseCase } from './get-user-by-id';
import { user } from '../../tests/index.js';

describe('GetUserById', () => {
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

    it('should throws if GetUserByIdRepository thrown a server error', async () => {
        const { getUserByIdRepository, getUserByIdUseCase } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const result = getUserByIdUseCase.execute(user.id);

        await expect(result).rejects.toThrow();
    });
});
