import { PasswordHasherAdapter } from '../../adapters/index.js';
import {
    GetUserByIdController,
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    GetUserBalanceController,
} from '../../controllers/index.js';
import {
    PostgresGetUserByIdRepository,
    PostgresCreateUserRepository,
    PostgresGetUserByEmailRepository,
    PostgresUpdateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
} from '../../repositories/postgres-db/index.js';
import {
    GetUserByIdUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
} from '../../use-cases/index.js';

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    return getUserByIdController;
};

export const makeCreateUserController = () => {
    const createUserRepository = new PostgresCreateUserRepository();
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
    const passwordHasherAdapter = new PasswordHasherAdapter();
    const createUserUseCase = new CreateUserUseCase(
        createUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
    );
    const createUserController = new CreateUserController(createUserUseCase);

    return createUserController;
};

export const makeUpdateUserController = () => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository,
    );
    const updateUserController = new UpdateUserController(updateUserUseCase);

    return updateUserController;
};

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository();
    const deleteUserUserCase = new DeleteUserUseCase(deleteUserRepository);
    const deleteUserController = new DeleteUserController(deleteUserUserCase);

    return deleteUserController;
};

export const makeGetUserBalanceController = () => {
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserBalanceRepository,
        getUserByIdRepository,
    );
    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    );

    return getUserBalanceController;
};
