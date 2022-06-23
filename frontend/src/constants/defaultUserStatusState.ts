import { IUserStatusContext } from "../interfaces/IUserStatusContext";
import { Login42, StatusMetrics } from "../interfaces/status.types";

export const defaultUserStatusState: IUserStatusContext = {
  statuses: new Map<Login42, StatusMetrics>(),
};
