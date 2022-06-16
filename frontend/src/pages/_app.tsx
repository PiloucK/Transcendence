import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { SessionProvider } from "../context/SessionContext";
import { MainLayout } from "../layouts/mainLayout";
import { ErrorProvider } from "../context/ErrorContext";
import { ErrorSnackbar } from "../components/Alerts/ErrorSnackbar";
import { SecondFactorLogin } from "../components/Alerts/SecondFactorLogin";
import { SocketProvider } from "../context/SocketContext";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <ErrorProvider>
      <SocketProvider>
        <SessionProvider>
          {getLayout(
            <>
              <ErrorSnackbar />
              <SecondFactorLogin />
              <Component {...pageProps} />
            </>
          )}
        </SessionProvider>
      </SocketProvider>
    </ErrorProvider>
  );
}
