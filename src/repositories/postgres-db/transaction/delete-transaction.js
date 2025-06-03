import { prisma } from '../../../../prisma/prisma.js';

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            });
        } catch (error) {
            console.log(error);

            return null;
        }
    }
}
