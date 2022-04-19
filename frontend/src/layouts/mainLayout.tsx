import React from "react";
import Router from "next/router";

// It would be way better to put that in a context, but I don't know how to do that.
let previousPage = false;

interface Props {
  children: React.ReactNode;
}

function onDown(event: KeyboardEvent) {

  if (event.key === "Escape") {
    const { pathname } = Router;
    if (pathname !== "/") {
			if (previousPage === false) {
				previousPage = true;
			}
      Router.push("/");
    } else if (pathname === "/" && previousPage === true) {
			console.log(window.history);
      window.history.back();
    }
  }
}

export const MainLayout: React.FunctionComponent<Props> = ({ children }) => {
  // This if statement is needed due to the server-side rendering of next.js
  if (typeof window !== "undefined") {
    document.addEventListener("keyup", onDown);
  }

  return <>{children}</>;
};
