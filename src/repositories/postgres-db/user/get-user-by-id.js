import { PostgresHelper } from '../../../db/postgres-db/helper.js';

export class PostgresGetUserByIdRepository {
    async execute(userId) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE id = $1',
            [userId],
        );

        return user[0];
    }
}
