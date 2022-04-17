import React from "react";

interface Props {
  children: React.ReactNode;
}

export const MainLayout: React.FunctionComponent<Props> = ({ children }) => {
  return <>{children}</>;
};
