import axios, { AxiosError } from "axios";
import { defaultErrorData } from "../constants/defaultErrorData";
import { HttpStatusCodes } from "../constants/httpStatusCodes";
import { IErrorData } from "../interfaces/IErrorData";
import { ISessionContext } from "../interfaces/ISessionContext";

export function errorHandler(
  error: Error | AxiosError,
  sessionContext: ISessionContext,
): IErrorData {
  let errorData: IErrorData = defaultErrorData;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      errorData = error.response.data as IErrorData;
      if (errorData.statusCode === HttpStatusCodes.UNAUTHORIZED) {
        if (!errorData.error) {
          sessionContext.logout?.();
        } else if (errorData.message === 'Not double-authenticated') {
          sessionContext.setShowSecondFactorLogin?.(true);
        }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Error in HTTP request:", error.request);
      errorData.error = "HTTP request failure";
      errorData.message = "Request made but no response received.";
      errorData.statusCode = HttpStatusCodes.UNKNOWN_ERROR;
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request. Message:", error.message);
    errorData.error = "Error setting up the HTTP request";
    errorData.message = error.message;
    errorData.statusCode = HttpStatusCodes.UNKNOWN_ERROR;
  }

  return errorData;
}
