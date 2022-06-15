import axios, { AxiosError } from "axios";
import { HttpStatusCodes } from "../constants/httpStatusCodes";
import { defaultErrorData, IErrorData } from "../interfaces/IErrorData";

export function errorHandler(
  error: Error | AxiosError,
  loginContext: any
): IErrorData {
  // TODO: loginContext define the type
  let errorData: IErrorData = defaultErrorData;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      errorData = error.response.data as IErrorData;
      if (errorData.statusCode === HttpStatusCodes.UNAUTHORIZED) {
        if (!errorData.error) {
          loginContext.logout?.();
        } else if (errorData.message === 'Not double-authenticated') {
          loginContext.setShowSecondFactorLogin?.(true);
        }
        // } else if (error.response.status === NOT_FOUND) {
        // } else if (error.response.status === CONFLICT) {
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
