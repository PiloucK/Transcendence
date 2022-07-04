import { Dispatch, SetStateAction } from "react";

export function showOverlayOnEscape(
  showOverlay: boolean,
  setShowOverlay: Dispatch<SetStateAction<boolean>>
) {
  const OnUp = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowOverlay(!showOverlay);
    }
  };

  // This if statement is needed due to the server-side rendering of next.js
  if (typeof window !== "undefined") {
    document.addEventListener("keyup", OnUp);
  }
}
