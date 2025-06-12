import { prisma } from './prisma/prisma';
import { beforeEach } from '@jest/globals';

beforeEach(async () => {
    await prisma.user.deleteMany({});
    await prisma.transaction.deleteMany({});
});
