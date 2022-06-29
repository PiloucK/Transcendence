import { EmittedLiveStatus, Login42, StatusMap } from "./status.types";

export interface IUserStatusContext {
  statuses: StatusMap;
  setStatuses?: (statuses: StatusMap) => void;
  handleStatusUpdate?: (
    userLogin42: Login42,
    status: EmittedLiveStatus
  ) => void;
}
