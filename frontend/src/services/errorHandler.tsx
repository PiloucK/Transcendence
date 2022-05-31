import axios, { AxiosError } from "axios";
import { useErrorContext } from "../context/ErrorContext";

const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;

export function errorHandler(error: Error | AxiosError, loginContext: any) { // TODO: loginContext define the type
  const errorContext = useErrorContext();

  interface ErrorData {
    error: string;
    message: string;
    statusCode: number;
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      console.error("HTTP response status code:", error.response.status);
      errorContext.newError?.(error.response.data as ErrorData);
      if (error.response.status === UNAUTHORIZED) {
        // and for restrictToReqUser?
        loginContext.logout?.();
      } else if (error.response.status === NOT_FOUND) {
      } else if (error.response.status === CONFLICT) {
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Error in HTTP request:", error.request);
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request. Message:", error.message);
  }
}
