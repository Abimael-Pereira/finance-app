import { Prisma, TransactionType } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma.js';

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFilter = {
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        };

        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                userId,
                type: TransactionType.EXPENSE,
                ...dateFilter,
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
                ...dateFilter,
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
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        });

        const balance = new Prisma.Decimal(
            totalEarnings - totalExpenses - totalInvestments,
        );
        return {
            earnings: totalEarnings === null ? '0' : totalEarnings,
            expenses: totalExpenses === null ? '0' : totalExpenses,
            investments: totalInvestments === null ? '0' : totalInvestments,
            balance,
        };
    }
}
