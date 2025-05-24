import { PostgresGetUserByIdRepository } from '../repositories/postgres-db/get-user-by-id';

export class GetUserByIdUserCase {
    async execute(userId) {
        const getUserByIdPostgres = new PostgresGetUserByIdRepository();

        const user = getUserByIdPostgres.execute(userId);

        return user;
    }
}
