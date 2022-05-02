import '../globals.css';
import ApplicationFrame from '../application/ApplicationFrame';
import { OrphanProvider, OrphanContainer } from '../components/common/hooks/orphan';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): React.ReactElement {
  return (
    <OrphanProvider>
      <SessionProvider session={session}>
        <Head>
          <title>Kusokollagen</title>
        </Head>
        <OrphanContainer />
        <ApplicationFrame>
          <Component {...pageProps} />
        </ApplicationFrame>
      </SessionProvider>
    </OrphanProvider>
  );
}
