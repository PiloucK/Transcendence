import { StatusMap } from "./status.types";

export interface IUserStatusContext {
  statuses: StatusMap;
  setStatuses?: (statuses: StatusMap) => void;
}
