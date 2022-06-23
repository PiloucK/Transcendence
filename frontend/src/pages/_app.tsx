import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { SessionProvider } from "../context/SessionContext";
import { ErrorProvider } from "../context/ErrorContext";
import { SocketProvider } from "../context/SocketContext";
import { DefaultLayout } from "../layouts/defaultLayout";
import { ErrorSnackbar } from "../components/Alerts/ErrorSnackbar";
import { UserStatusProvider } from "../context/UserStatusContext";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
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
  );
}
