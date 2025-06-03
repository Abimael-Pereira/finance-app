import { prisma } from '../../../../prisma/prisma.js';

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            },
        });

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        });

        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        });

        const balance = totalEarnings - totalExpenses - totalInvestments;
        return {
            earnings: totalEarnings,
            expenses: totalExpenses,
            invesments: totalInvestments,
            balance,
        };
    }
}
