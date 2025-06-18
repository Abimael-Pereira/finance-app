import { Prisma, TransactionType } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma.js';

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                userId,
                type: TransactionType.EXPENSE,
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
                type: TransactionType.EARNING,
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
                type: TransactionType.INVESTMENT,
            },
            _sum: {
                amount: true,
            },
        });

        const balance = new Prisma.Decimal(
            totalEarnings - totalExpenses - totalInvestments,
        );
        return {
            earnings: totalEarnings,
            expenses: totalExpenses,
            investments: totalInvestments,
            balance,
        };
    }
}
