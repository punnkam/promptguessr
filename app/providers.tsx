'use client';
import { SessionProvider } from 'next-auth/react';

export function Providers({
  children,
  pageProps: { session, ...pageProps },
}: any) {
  console.log(pageProps);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
