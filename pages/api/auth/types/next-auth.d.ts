import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      image: string | undefined;
      name: ReactNode;
      /** The user's postal address. */
      address: string;
    };
  }
}
