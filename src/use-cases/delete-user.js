import { PostgresDeleteUserRepository } from '../repositories/postgres-db/delete-user.js';

export class DeleteUserUseCase {
    async execute(userId) {
        const deleteUserPostgres = new PostgresDeleteUserRepository();

        const deletedUser = deleteUserPostgres.execute(userId);

        return deletedUser;
    }
}
