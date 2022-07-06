import { defaultSessionState } from "../../constants/defaultSessionState";
import { useSessionContext } from "../../context/SessionContext";
import { DockGuest } from "./DockGuest";
import { DockUser } from "./DockUser";

export function DockSelector() {
  const sessionContext = useSessionContext();

  if (sessionContext.userSelf !== defaultSessionState.userSelf) {
    return <DockUser />;
  } else {
    return <DockGuest />;
  }
}
