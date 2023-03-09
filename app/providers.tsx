'use client';
import { SessionProvider } from 'next-auth/react';

export function Providers({
    children,
    pageProps: { session, ...pageProps },
}: any) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
