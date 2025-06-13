import { user as fakeUser } from '../../../tests';
import { prisma } from '../../../../prisma/prisma';
import { PostgresGetUserBalanceRepository } from './get-user-balance';
import { faker } from '@faker-js/faker';
import { TransactionType } from '@prisma/client';

describe('GetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        await prisma.user.create({ data: fakeUser });

        await prisma.transaction.createMany({
            data: [
                {
                    userId: fakeUser.id,
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    amount: 5000,
                    type: 'EARNING',
                },
                {
                    userId: fakeUser.id,
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    amount: 5000,
                    type: 'EARNING',
                },
                {
                    userId: fakeUser.id,
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    amount: 1000,
                    type: 'EXPENSE',
                },
                {
                    userId: fakeUser.id,
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    amount: 1000,
                    type: 'EXPENSE',
                },
                {
                    userId: fakeUser.id,
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    amount: 3000,
                    type: 'INVESTMENT',
                },
                {
                    userId: fakeUser.id,
                    name: faker.string.sample(),
                    date: faker.date.recent(),
                    amount: 3000,
                    type: 'INVESTMENT',
                },
            ],
        });

        const sut = new PostgresGetUserBalanceRepository();

        const result = await sut.execute(fakeUser.id);

        expect(result.earnings.toString()).toBe('10000');
        expect(result.expenses.toString()).toBe('2000');
        expect(result.invesments.toString()).toBe('6000');
        expect(result.balance.toString()).toBe('2000');
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate');

        await sut.execute(fakeUser.id);

        expect(prismaSpy).toHaveBeenCalledTimes(3);
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                userId: fakeUser.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        });
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                userId: fakeUser.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        });
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                userId: fakeUser.id,
                type: TransactionType.INVESTMENT,
            },
            _sum: {
                amount: true,
            },
        });
    });
});
