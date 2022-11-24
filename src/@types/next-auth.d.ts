import 'next-auth';

declare module 'next-auth' {
  import type { DefaultSession } from 'next-auth';

  interface Session {
    user: NonNullable<DefaultSession['user']> & {
      // extended by kusokollagen (See src/pages/api/auth/[...nextauth].ts)
      id: string;
      role: 'USER' | 'ADMIN';
    };
  }
}
