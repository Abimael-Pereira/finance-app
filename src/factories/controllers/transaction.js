import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '../../controllers/index.js';
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
} from '../../repositories/postgres-db/index.js';
import {
    CreateTrasactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js';

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const createTransactionUseCase = new CreateTrasactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    );
    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    );
    return createTransactionController;
};

export const makeGetTransactionsByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository();
    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository,
    );
    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);
    return getTransactionsByUserIdController;
};

export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository();
    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
    );
    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    );

    return updateTransactionController;
};

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository();
    const deleteTransactionUserCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
    );
    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUserCase,
    );

    return deleteTransactionController;
};
