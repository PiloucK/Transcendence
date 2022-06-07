import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { LoginProvider } from "../context/LoginContext";
import { MainLayout } from "../layouts/mainLayout";
import { ErrorProvider } from "../context/ErrorContext";
import { ErrorSnackbar } from "../components/Alerts/ErrorSnackbar";
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

  return getLayout(
    <SocketProvider>
      <ErrorProvider>
        <LoginProvider>
          <>
            <ErrorSnackbar />
            <Component {...pageProps} />
          </>
        </LoginProvider>
      </ErrorProvider>
    </SocketProvider>
  );
}
