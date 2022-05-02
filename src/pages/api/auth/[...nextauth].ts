import prisma from '../../../backend/prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { User as DatabaseUser } from '@prisma/client';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        const databaseUser = user as DatabaseUser;
        session.user.id = databaseUser.id;
        session.user.role = databaseUser.role;
      }
      return session;
    },
  },
});
