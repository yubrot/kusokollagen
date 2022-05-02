import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      // next-auth default (This type is not named)
      name?: string | null;
      email?: string | null;
      image?: string | null;

      // extended by kusokollagen (See src/pages/api/auth/[...nextauth].ts)
      id: string;
      role: 'USER' | 'ADMIN';
    };
  }
}
