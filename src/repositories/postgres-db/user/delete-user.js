import { UserNotFoundError } from '../../../errors/index.js';
import { prisma } from '../../../../prisma/prisma.js';

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new UserNotFoundError(userId);
            }

            throw error;
        }
    }
}
