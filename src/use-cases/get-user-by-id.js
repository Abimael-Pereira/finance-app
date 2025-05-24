import { PostgresGetUserByIdRepository } from '../repositories/postgres-db/get-user-by-id.js';

export class GetUserByIdUseCase {
    async execute(userId) {
        const getUserByIdPostgres = new PostgresGetUserByIdRepository();

        const user = getUserByIdPostgres.execute(userId);

        return user;
    }
}
