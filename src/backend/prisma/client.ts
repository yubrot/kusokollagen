// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

const client = global.prismaClient || new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

if (process.env.NODE_ENV !== 'production') global.prismaClient = client;

export default client;
