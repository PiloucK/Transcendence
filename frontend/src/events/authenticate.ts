import { IErrorContext } from "../interfaces/IErrorContext";
import { ISessionContext } from "../interfaces/ISessionContext";
import { ISocketContext } from "../interfaces/ISocketContext";
import { errorHandler } from "../errors/errorHandler";
import authService from "../services/auth";
import Cookies from "js-cookie";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const authenticate = (
  errorContext: IErrorContext,
  socketContext: ISocketContext,
  sessionContext: ISessionContext
) => {
  if (Cookies.get(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME)) {
    authService
      .getLoggedInUser()
      .then((userSelf) => {
        sessionContext.login?.(userSelf);
        socketContext.socket.emit("user:new");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  }
};
