import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";

import { SessionProvider } from "../context/SessionContext";
import { ErrorProvider } from "../context/ErrorContext";
import { SocketProvider } from "../context/SocketContext";
import { DefaultLayout } from "../layouts/defaultLayout";
import { ErrorSnackbar } from "../components/Alerts/ErrorSnackbar";
import { UserStatusProvider } from "../context/UserStatusContext";
import {UserStatusLayout} from "../layouts/userStatusLayout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ?? ((page) =>
      <UserStatusLayout>
        <DefaultLayout>{page}</DefaultLayout>
      </UserStatusLayout>
    );

  return (
    <>
      <Head>
        <title>Transcendence</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <ErrorProvider>
        <ErrorSnackbar />
        <SocketProvider>
          <SessionProvider>
            <UserStatusProvider>
              {getLayout(<Component {...pageProps} />)}
            </UserStatusProvider>
          </SessionProvider>
        </SocketProvider>
      </ErrorProvider>
    </>
  );
}
