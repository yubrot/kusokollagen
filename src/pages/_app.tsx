import '../globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): React.ReactElement {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Kusokollagen</title>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
