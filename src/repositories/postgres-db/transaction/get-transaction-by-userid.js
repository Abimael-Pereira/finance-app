import { PostgresHelper } from '../../../db/postgres-db/helper.js';

export class PostgresGetTransactionByUserId {
    execute(userId) {
        const transactions = PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId],
        );

        return transactions;
    }
}
