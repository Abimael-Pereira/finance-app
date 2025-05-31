import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
} from '../../controllers/index.js';
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionsByUserIdRepository,
} from '../../repositories/postgres-db/index.js';
import {
    CreateTrasactionUseCase,
    GetTransactionsByUserIdUseCase,
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
