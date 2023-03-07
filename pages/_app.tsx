import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

type MyAppProps = AppProps & {
  pageProps: {
    session: any;
  };
};

export default function App({ Component, pageProps }: MyAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
