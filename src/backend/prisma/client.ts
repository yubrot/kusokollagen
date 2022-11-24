// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices

import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  var prismaClient: PrismaClient | undefined;
}

const client = global.prismaClient || new PrismaClient({ log: getLogLevels() });

if (process.env.NODE_ENV !== 'production') global.prismaClient = client;

export default client;

function getLogLevels(): Prisma.LogLevel[] {
  switch (process.env.PRISMA_MINIMUM_LOG_LEVEL) {
    case 'error':
      return ['error'];
    case 'warn':
      return ['warn', 'error'];
    case 'info':
      return ['info', 'warn', 'error'];
    case 'query':
      return ['query', 'info', 'warn', 'error'];
    default:
      return ['warn', 'error'];
  }
}
