import { IErrorContext } from "../interfaces/IErrorContext";
import { ISessionContext } from "../interfaces/ISessionContext";
import { ISocketContext } from "../interfaces/ISocketContext";
import { errorHandler } from "../errors/errorHandler";
import authService from "../services/auth";
import Cookies from "js-cookie";
import getConfig from "next/config";
import { AxiosError } from "axios";
import { HttpStatusCodes } from "../constants/httpStatusCodes";
import Router from "next/router";

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
      .catch((caughtError: Error | AxiosError) => {
        const parsedError = errorHandler(caughtError, sessionContext);
        if (
          parsedError.statusCode === HttpStatusCodes.UNAUTHORIZED &&
          parsedError.message === "Not double-authenticated"
        ) {
          Router.push("/second-factor-login");
        } else {
          errorContext.newError?.(parsedError);
        }
      });
  }
};
