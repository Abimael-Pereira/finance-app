import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs-plugin-utc';
import { prisma } from '../../../../prisma/prisma';
import { transaction, user } from '../../../tests';
import { PostgresGetTransactionByIdRepository } from './get-transaction-by-id.js';

dayjs.extend(dayjsPluginUTC);

describe('GetTransactionByIdUseCase', () => {
    it('should get transaction by id successfully', async () => {
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, userId: user.id },
        });

        const sut = new PostgresGetTransactionByIdRepository();

        const result = await sut.execute(transaction.id);

        expect({
            ...result,
            amount: result.amount.toString(),
            date: dayjs.utc(result.date).format('YYYY-MM-DD'),
        }).toStrictEqual({
            ...transaction,
            amount: transaction.amount.toString(),
            userId: user.id,
            date: dayjs.utc(transaction.date).format('YYYY-MM-DD'),
        });
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionByIdRepository();

        const prismaSpy = jest.spyOn(prisma.transaction, 'findUnique');

        await sut.execute(transaction.id);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        });
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetTransactionByIdRepository();

        jest.spyOn(prisma.transaction, 'findUnique').mockImplementationOnce(
            () => {
                throw new Error();
            },
        );

        await expect(sut.execute(transaction.id)).rejects.toThrow();
    });
});
