import 'dotenv/config.js';
import express from 'express';
import {
    UpdateUserController,
    CreateUserController,
    GetUserByIdController,
    DeleteUserController,
} from './src/controllers/index.js';
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js';
import { PostgresGetUserByIdRepository } from './src/repositories/postgres-db/get-user-by-id.js';
import { PostgresCreateUserRepository } from './src/repositories/postgres-db/create-user.js';
import { CreateUserUseCase } from './src/use-cases/create-user.js';
import { UpdateUserUseCase } from './src/use-cases/update-user.js';
import { DeleteUserUseCase } from './src/use-cases/delete-user.js';
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres-db/get-user-by-email.js';
import { PostgresUpdateUserRepository } from './src/repositories/postgres-db/update-user.js';
import { PostgresDeleteUserRepository } from './src/repositories/postgres-db/delete-user.js';

const app = express();
app.use(express.json());

app.get('/api/users/:userid', async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    const { statusCode, body } = await getUserByIdController.execute(request);

    response.status(statusCode).send(body);
});

app.post('/api/users', async (request, response) => {
    const createUserRepository = new PostgresCreateUserRepository();
    const createUserUseCase = new CreateUserUseCase(createUserRepository);
    const createUserController = new CreateUserController(createUserUseCase);

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).json(body);
});

app.patch('/api/users/:userid', async (request, response) => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository,
    );
    const updateUserController = new UpdateUserController(updateUserUseCase);
    const { statusCode, body } = await updateUserController.execute(request);

    response.status(statusCode).send(body);
});

app.delete('/api/users/:userid', async (request, response) => {
    const deleteUserRepository = new PostgresDeleteUserRepository();
    const deleteUserUserCase = new DeleteUserUseCase(deleteUserRepository);
    const deleteUserController = new DeleteUserController(deleteUserUserCase);
    const { statusCode, body } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
);
