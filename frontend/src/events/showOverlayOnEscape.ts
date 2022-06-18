import Router from "next/router";

// It would be way better to put that in a context, but I don't know how to do that.
let previousPage = false;

function OnUp(event: KeyboardEvent) {
  // const previousPage = useRef(false);

  if (event.key === "Escape") {
    const { pathname } = Router;
    if (pathname !== "/") {
      if (previousPage === false) {
        previousPage = true;
      }
      Router.push("/");
    } else if (previousPage === true) {
      window.history.back();
    }
  }
}

export function showOverlayOnEscape() {
  // This if statement is needed due to the server-side rendering of next.js
  if (typeof window !== "undefined") {
    document.addEventListener("keyup", OnUp);
  }
}